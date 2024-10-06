import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Lead, LeadSchema } from 'src/lead/lead.schema';
import { LeadBridge, LeadBridgeSchema } from 'src/leadBridge/leadBridge.schema';

import { CampaignController } from './campaign.controller';
import { Campaign, CampaignSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';
import { Email, EmailSchema } from 'src/email/email.schema';
import { CampaignCronService } from './campaign.cron';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: LeadBridge.name, schema: LeadBridgeSchema },
      { name: Email.name, schema: EmailSchema },
    ]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, ConfigService, CampaignCronService],
  exports: [CampaignService],
})
export class CampaignModule {}
