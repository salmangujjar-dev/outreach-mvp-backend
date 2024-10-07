import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

import { LeadDTO, PDLDTO } from 'src/lead/lead.dto';
import { Lead } from 'src/lead/lead.schema';
import { LeadBridge } from 'src/leadBridge/leadBridge.schema';

import { TCreateCampaign, TSearchLeads } from './campaign.dto';
import { generateESQuery } from './campaign.helper';
import { Campaign, CAMPAIGN_STEP } from './campaign.schema';
import { Email } from 'src/email/email.schema';

@Injectable()
export class CampaignService {
  private pdlSearchApi: string;
  private pdlApiKey: string;
  private aiServerUrl: string;

  private readonly logger = new Logger(CampaignService.name);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
    @InjectModel(LeadBridge.name) private leadBridgeModel: Model<LeadBridge>,
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private configService: ConfigService,
  ) {
    this.pdlSearchApi = this.configService.get<string>('PDL_SEARCH_API');
    this.pdlApiKey = this.configService.get<string>('PDL_API_KEY');
    this.aiServerUrl = this.configService.get<string>('AI_SERVER_URL');
  }

  async create(createCampaignDto: TCreateCampaign): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    return createdCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async findOne(id: string): Promise<Campaign> {
    return this.campaignModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCampaignDto: Partial<TCreateCampaign>,
  ): Promise<Campaign> {
    return this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Campaign> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }

  async getLeads(id: string): Promise<Lead[]> {
    const leads = await this.leadBridgeModel
      .find({ campaign: id })
      .populate('lead')
      .exec();
    return leads.map((leadBridge) => leadBridge.lead);
  }

  async getLeadsWithEmails(id: string): Promise<LeadBridge[]> {
    const leads = await this.leadBridgeModel
      .find({ campaign: id })
      .populate('lead email')
      .exec();
    return leads;
  }

  async generateEmails(id: string) {
    try {
      const campaign = await this.campaignModel
        .findOne({ _id: id })
        .populate({ path: 'leads', populate: 'lead' })
        .populate('persona')
        .exec();

      if (!campaign) {
        throw new Error('Campaign not found.');
      }
      if (!campaign.leads) {
        throw new Error('Campaign has no leads.');
      }
      if (!campaign.persona) {
        throw new Error('Campaign has no persona.');
      }
      console.log({ campaign });

      const emailPromises = campaign.leads.slice(0, 1).map(async (lead) => {
        try {
          const response = await axios.post(
            this.aiServerUrl,
            {
              lead: lead.lead,
              persona: campaign.persona,
              probability: campaign.leadProbability,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          const emailData = {
            campaign: campaign._id,
            body: response.data.body,
            subject: response.data.subject,
          };

          const email = await this.emailModel.create(emailData);

          await this.leadBridgeModel.findByIdAndUpdate(lead._id, {
            $set: { email: email._id },
          });

          return email;
        } catch (error) {
          this.logger.error(
            `Error processing lead ${lead.lead.uniqueIdentifier}:`,
            error,
          );
        }
      });

      return await Promise.all(emailPromises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async searchLeads(id: string, filters: TSearchLeads) {
    const mustClauses = generateESQuery(filters);

    const esQuery = {
      query: {
        bool: {
          must: mustClauses,
        },
      },
    };

    const params = {
      size: 10,
      dataset: 'resume',
      titlecase: true,
      pretty: true,
      ...esQuery,
    };

    const response = await axios
      .post(this.pdlSearchApi, params, {
        headers: {
          'X-Api-Key': this.pdlApiKey,
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          accept: 'application/json',
        },
      })
      .then(async (response) => {
        const {
          data: fullData,
          scroll_token: scrollToken,
          total: totalNumber,
          dataset_version: datasetVersion,
        } = response.data;

        const data: LeadDTO[] = fullData.map((data: PDLDTO) => ({
          uniqueIdentifier: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          fullName: data.full_name,
          linkedinUrl: 'https://www.' + data.linkedin_url,
          linkedinUsername: data.linkedin_username,
          linkedinId: data.linkedin_id,
          twitterUrl: 'https://www.' + data.twitter_url,
          twitterUsername: data.twitter_username,
          workEmail: data.work_email,
          industry: data.industry,
          jobTitle: data.job_title,
          jobCompanyName: data?.job_company_name || '',
          jobCompanyWebsite: data?.job_company_website
            ? 'https://' + data.job_company_website
            : '',
          jobCompanyIndustry: data?.job_company_industry || '',
          jobCompany12moEmployeeGrowthRate:
            data?.job_company_12mo_employee_growth_rate || 0,
          jobCompanyTotalFundingRaised:
            data?.job_company_total_funding_raised || 0,
          jobCompanyInferredRevenue: data?.job_company_inferred_revenue,
          jobCompanyEmployeeCount: data?.job_company_employee_count || 0,
          jobLastChanged: data?.job_last_changed,
          jobLastVerified: data?.job_last_verified,
          jobStartDate: data?.job_start_date,
          jobCompanySize: data?.job_company_size,
          jobCompanyFounded: data?.job_company_founded || 0,
          jobCompanyLocationRegion: data?.job_company_location_region || '',
          locationName: data.location_name,
          locationCountry: data?.location_country || '',
          skills: data.skills,
          education: {
            school: data.education?.[0]?.school?.name || '',
            linkedinUrl: data.education?.[0]?.school?.linkedin_url || '',
            startDate: data.education?.[0]?.start_date || null,
            endDate: data.education?.[0]?.end_date || null,
            degreeName: data.education?.[0]?.degrees?.[0] || null,
            raw: data.education?.[0]?.raw,
            summary: data.education?.[0]?.summary || '',
          },
          gender: data.sex,
          companyEmployees: data?.job_company_size || '',
          dataProvider: 'pdl',
        }));

        const insertedLeads = await this.leadModel.insertMany(data);
        console.log({ id });
        const leadBridgeData = insertedLeads.map((lead) => ({
          lead: lead._id,
          campaign: id,
        }));

        const insertLeadBridges =
          await this.leadBridgeModel.insertMany(leadBridgeData);

        await this.campaignModel.findByIdAndUpdate(id, {
          $set: {
            stepper: CAMPAIGN_STEP.LEADS,
            leads: insertLeadBridges.map((leadBridge) => leadBridge._id),
          },
        });

        return {
          data,
          scrollToken,
          totalNumber,
          datasetVersion,
        };
      })
      .catch((error) => {
        console.log(error);
      });

    return response;
  }
}
