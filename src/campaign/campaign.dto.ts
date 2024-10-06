import { LEAD_PROBABILITY } from './campaign.enums';

export type TCreateCampaign = {
  name: string;
  persona: string;
  leadProbability: LEAD_PROBABILITY;
  sendLimit: number;
};
