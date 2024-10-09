import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { RevenueStages, CompanySize } from './lead.dto';

@Schema({ collection: 'Lead', timestamps: true })
export class Lead extends Document {
  @Prop({ required: true })
  uniqueIdentifier: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  linkedinUrl: string;

  @Prop()
  linkedinUsername: string;

  @Prop()
  linkedinId: string;

  @Prop()
  twitterUrl: string;

  @Prop()
  twitterUsername: string;

  @Prop()
  workEmail: string;

  @Prop()
  industry: string;

  @Prop()
  jobTitle: string;

  @Prop()
  jobCompanyName: string;

  @Prop()
  jobCompanyWebsite: string;

  @Prop()
  jobCompanyIndustry: string;

  @Prop()
  jobCompany12moEmployeeGrowthRate: number;

  @Prop()
  jobCompanyTotalFundingRaised: number;

  @Prop({ type: String, enum: RevenueStages })
  jobCompanyInferredRevenue: RevenueStages | null;

  @Prop()
  jobCompanyEmployeeCount: number;

  @Prop()
  jobLastChanged: string;

  @Prop()
  jobLastVerified: string;

  @Prop()
  jobStartDate: string;

  @Prop({ type: String, enum: CompanySize })
  jobCompanySize: CompanySize | null;

  @Prop()
  jobCompanyFounded: number;

  @Prop()
  jobCompanyLocationRegion: string;

  @Prop()
  locationName: string;

  @Prop()
  locationCountry: string;

  @Prop([String])
  skills: string[];

  @Prop({
    type: {
      school: String,
      linkedinUrl: String,
      startDate: String,
      endDate: String,
      degreeName: String,
      raw: [String],
      summary: String,
    },
  })
  education: {
    school: string;
    linkedinUrl: string;
    startDate: string | null;
    endDate: string | null;
    degreeName: string | null;
    raw: string[];
    summary: string;
  };

  @Prop()
  gender: string;

  @Prop()
  companyEmployees: string;

  @Prop()
  dataProvider: string;

  _id: mongoose.Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
