import { LeadDTO } from 'src/lead/lead.dto';

import { LEAD_PROBABILITY } from './campaign.enums';
import { CAMPAIGN_STEP } from './campaign.schema';

export type TLinkedIn = {
  li_at: string;
  JSESSIONID: string;
  messageTemplate: string;
};

export type TCreateCampaign = {
  name: string;
  stepper: CAMPAIGN_STEP;
  persona: string;
  leadProbability: LEAD_PROBABILITY;
  sendLimit: number;
  linkedin: TLinkedIn;
};

export type TSearchLeads = {
  locations: string[];
  industries: string[];
  companySizes: string[];
};

export type TSearchLeadsResponse = {
  data: LeadDTO[];
  scrollToken: string;
  totalNumber: number;
  datasetVersion: string;
};
