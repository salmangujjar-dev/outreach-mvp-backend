import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CAMPAIGN_STATUS } from './campaign.schema';
import { Email } from 'src/email/email.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { TLinkedIn } from './campaign.dto';
import { Lead } from 'src/lead/lead.schema';
import { LINKEDIN_HEADERS } from './campaign.constants';

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
  @Cron('0 */1 * * * *')
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
        .filter((lead) => lead.email?.sent !== true)
        .slice(0, campaign.sendLimit);
      for (const leadBridge of leadsToProcess) {
        const lead = leadBridge.lead;
        try {
          await this.sendMail(lead.workEmail, leadBridge.email);
          if (campaign?.linkedin?.isValid) {
            await this.connectOnLinkedIn(
              String(campaign._id),
              lead,
              campaign.linkedin,
            );
          }
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

  async connectOnLinkedIn(campaignId: string, lead: Lead, linkedin: TLinkedIn) {
    try {
      const message = linkedin.messageTemplate.replace(
        /{([^}]+)}/g,
        (match, p1) => lead[p1] || match,
      );

      const profileUrn = await this.getProfileUrn(
        linkedin,
        lead.linkedinUsername,
      );

      console.log({ message });
      console.log({ profileUrn });

      const response = await fetch(
        'https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreateV2&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2',
        {
          method: 'POST',
          headers: {
            Cookie: `JSESSIONID=${linkedin.JSESSIONID};li_at=${linkedin.li_at}`,
            'Csrf-Token': linkedin.JSESSIONID,
            ...LINKEDIN_HEADERS,
          },
          body: JSON.stringify({
            customMessage: message,
            invitee: {
              inviteeUnion: {
                memberProfile: 'urn:li:fsd_profile:' + profileUrn,
              },
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to connect with LinkedIn ID ${lead.linkedinId}`,
        );
      }

      this.logger.log(
        `Successfully sent Connection Request to LinkedIn ID ${lead.linkedinId}`,
      );
    } catch (error) {
      await this.campaignModel.findByIdAndUpdate(campaignId, {
        $set: { linkedin: { ...linkedin, isValid: false } },
      });

      this.logger.error(
        `Exception occurred while connecting with LinkedIn ID ${lead.linkedinId}:`,
        error,
      );
    }
  }

  async getProfileUrn(linkedin: TLinkedIn, profileUsername) {
    const url = `https://www.linkedin.com/voyager/api/identity/profiles/${profileUsername}/profileView`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: `JSESSIONID=${linkedin.JSESSIONID};li_at=${linkedin.li_at}`,
          'Csrf-Token': linkedin.JSESSIONID,
          ...LINKEDIN_HEADERS,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch profile view for LinkedIn username ${profileUsername}`,
        );
      }

      const profileData = await response.json();
      this.logger.log(
        `Successfully fetched profile view for LinkedIn username ${profileUsername}`,
      );
      console.log({ profileData });
      return profileData['data']['*profile'].split(':').pop();
    } catch (error) {
      this.logger.error(
        `Exception occurred while fetching profile view for LinkedIn username ${profileUsername}:`,
        error,
      );
      throw error;
    }
  }
}
