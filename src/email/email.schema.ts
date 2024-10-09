import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Campaign } from 'src/campaign/campaign.schema';

@Schema({ collection: 'Email', timestamps: true })
export class Email extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ default: false })
  sent: boolean;

  @Prop()
  sentOn: Date;

  @Prop({ default: false })
  bounced: boolean;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
