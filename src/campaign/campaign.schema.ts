import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Persona } from 'src/persona/persona.schema';
import { LeadBridge } from 'src/leadBridge/leadBridge.schema';

import { LEAD_PROBABILITY } from './campaign.enums';

@Schema()
export class Campaign extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Persona', required: true })
  persona: Persona;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Lead' }] })
  leads: LeadBridge[];

  @Prop({ required: true, enum: LEAD_PROBABILITY })
  leadProbability: LEAD_PROBABILITY;

  @Prop({ required: true })
  sendLimit: number;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
