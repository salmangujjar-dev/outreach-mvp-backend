import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { LeadBridge } from 'src/leadBridge/leadBridge.schema';
import { Persona } from 'src/persona/persona.schema';

import { LEAD_PROBABILITY } from './campaign.enums';

export enum CAMPAIGN_STEP {
  TARGET = 'TARGET',
  LEADS = 'LEADS',
  EMAILS = 'EMAILS',
}

export enum CAMPAIGN_STATUS {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
}

class LinkedIn {
  @Prop({ required: true })
  li_at: string;

  @Prop({ required: true })
  JSESSIONID: string;

  @Prop({ required: true })
  messageTemplate: string;

  @Prop({ default: true })
  isValid: boolean;
}

@Schema({ collection: 'Campaign', timestamps: true })
export class Campaign extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Persona', required: true })
  persona: Persona;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LeadBridge' }] })
  leads: LeadBridge[];

  @Prop({
    required: true,
    enum: LEAD_PROBABILITY,
    default: LEAD_PROBABILITY.LOW,
  })
  leadProbability: LEAD_PROBABILITY;

  @Prop({
    enum: CAMPAIGN_STATUS,
    default: CAMPAIGN_STATUS.DRAFT,
  })
  status: CAMPAIGN_STATUS;

  @Prop({ required: true, enum: CAMPAIGN_STEP, default: CAMPAIGN_STEP.TARGET })
  stepper: CAMPAIGN_STEP;

  @Prop({ type: LinkedIn })
  linkedin: LinkedIn;

  @Prop({ required: true })
  sendLimit: number;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;

  @Prop({ type: Date, default: null })
  lastProcessed: Date;

  @Prop({ default: 0 })
  totalLeads: number;

  @Prop({ default: 0 })
  totalEmails: number;

  @Prop({ default: 0 })
  totalSent: number;

  @Prop({ default: 0 })
  totalPending: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
