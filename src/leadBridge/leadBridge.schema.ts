import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Campaign } from '../campaign/campaign.schema';
import { Lead } from '../lead/lead.schema';
import { Email } from 'src/email/email.schema';

export type LeadBridgeDocument = LeadBridge & Document;

@Schema({ collection: 'LeadBridge' })
export class LeadBridge {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lead', required: true })
  lead: Lead;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Email', required: false })
  email: Email;
}

export const LeadBridgeSchema = SchemaFactory.createForClass(LeadBridge);
