// src/campaign/campaign-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CAMPAIGN_STATUS } from './campaign.schema';
import { Email } from 'src/email/email.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CampaignCronService {
  private readonly logger = new Logger(CampaignCronService.name);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private readonly mailerService: MailerService,
  ) {
    // const emailBody = 'Welcome to our campaign!';
    // const emailSubject = 'Test Email';
    // const recipientEmail = 'isalmandev@gmail.com';
    // const email = new this.emailModel({
    //   body: emailBody,
    //   subject: emailSubject,
    // });
    // this.sendMail(recipientEmail, email);
  }
  @Cron('0 */15 * * * *')
  async processCampaigns() {
    this.logger.log('Processing all campaigns...');
    const now = new Date().toISOString();
    const campaigns = await this.campaignModel
      .find({
        $and: [
          {
            $or: [
              { lastProcessed: { $lt: now } },
              { lastProcessed: { $eq: null } },
            ],
          },
          { startDate: { $lte: now } },
          {
            status: {
              $in: [CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.IN_PROCESS],
            },
          },
        ],
      })
      .populate({
        path: 'leads',
        populate: 'lead email',
      })
      .exec();

    const campaignIds = campaigns.map((campaign) => campaign._id);
    await this.campaignModel.updateMany(
      { _id: { $in: campaignIds } },
      {
        $set: {
          lastProcessed: new Date().toISOString(),
          status: CAMPAIGN_STATUS.IN_PROCESS,
        },
      },
    );

    for (const campaign of campaigns) {
      this.logger.log(`Processing campaign with ID: ${campaign._id}`);

      let totalEmailsSent = 0;
      const leadsToProcess = campaign.leads
        .filter((lead) => lead.email.sent !== true)
        .slice(0, campaign.sendLimit);
      for (const leadBridge of leadsToProcess) {
        const lead = leadBridge.lead;
        try {
          await this.sendMail(lead.workEmail, leadBridge.email);
          totalEmailsSent += 1;
          this.logger.log(`Email sent to: ${lead.workEmail}`);
        } catch (error) {
          this.logger.error(`Error sending email to ${lead.workEmail}:`, error);
        }
      }

      await this.campaignModel.findByIdAndUpdate(campaign._id, {
        $inc: {
          totalSent: totalEmailsSent,
          totalPending: -totalEmailsSent,
        },
        ...(campaign.totalSent + totalEmailsSent === campaign.totalEmails && {
          $set: {
            status: CAMPAIGN_STATUS.COMPLETED,
          },
        }),
      });
    }
  }

  async sendMail(workEmail: string, email: Email) {
    try {
      this.mailerService.addTransporter('sharedMailer', {
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PW,
        },
        secure: true,
      });

      await this.mailerService.sendMail({
        transporterName: 'sharedMailer',
        from: process.env.EMAIL,
        to: workEmail,
        subject: email.subject,
        text: email.body,
      });

      await this.emailModel.findByIdAndUpdate(email._id, {
        $set: { sent: true, sentOn: new Date() },
      });

      this.logger.log(`Email successfully sent to ${workEmail}`);
    } catch (error) {
      await this.emailModel.findByIdAndUpdate(email._id, {
        $set: { bounced: true },
      });
      this.logger.error(`Failed to send email to ${workEmail}:`, error);
      throw error;
    }
  }
}
