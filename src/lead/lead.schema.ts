import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { RevenueStages, CompanySize } from './lead.dto';

@Schema()
export class Lead extends Document {
  @Prop({ required: true })
  unique_identifier: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  full_name: string;

  @Prop()
  linkedin_url: string;

  @Prop()
  linkedin_username: string;

  @Prop()
  linkedin_id: string;

  @Prop()
  twitter_url: string;

  @Prop()
  twitter_username: string;

  @Prop()
  work_email: string;

  @Prop()
  industry: string;

  @Prop()
  job_title: string;

  @Prop()
  job_company_name: string;

  @Prop()
  job_company_website: string;

  @Prop()
  job_company_industry: string;

  @Prop()
  job_company_12mo_employee_growth_rate: number;

  @Prop()
  job_company_total_funding_raised: number;

  @Prop({ type: String, enum: RevenueStages })
  job_company_inferred_revenue: RevenueStages | null;

  @Prop()
  job_company_employee_count: number;

  @Prop()
  job_last_changed: string;

  @Prop()
  job_last_verified: string;

  @Prop()
  job_start_date: string;

  @Prop({ type: String, enum: CompanySize })
  job_company_size: CompanySize | null;

  @Prop()
  job_company_founded: number;

  @Prop()
  job_company_location_region: string;

  @Prop()
  location_name: string;

  @Prop()
  location_country: string;

  @Prop([String])
  skills: string[];

  @Prop({
    type: {
      school: String,
      linkedin_url: String,
      start_date: String,
      end_date: String,
      degree_name: String,
      raw: [String],
      summary: String,
    },
  })
  education: {
    school: string;
    linkedin_url: string;
    start_date: string | null;
    end_date: string | null;
    degree_name: string | null;
    raw: string[];
    summary: string;
  };

  @Prop()
  gender: string;

  @Prop()
  company_employees: string;

  @Prop()
  data_provider: string;

  _id: mongoose.Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
