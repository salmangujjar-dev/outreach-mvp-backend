import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';

import {
  TCreateCampaign,
  TSearchLeads,
  TSearchLeadsResponse,
} from './campaign.dto';
import { Campaign } from './campaign.schema';
import { CampaignService } from './campaign.service';
import { Lead } from 'src/lead/lead.schema';
import { LeadBridge } from 'src/leadBridge/leadBridge.schema';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Body() createCampaignDto: TCreateCampaign): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  findAll(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: Partial<TCreateCampaign>,
  ): Promise<Campaign> {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.remove(id);
  }

  @Post(':id/search-leads')
  async searchLeads(
    @Param('id') id: string,
    @Body() filters: TSearchLeads,
  ): Promise<void | TSearchLeadsResponse> {
    return this.campaignService.searchLeads(id, filters);
  }

  @Get(':id/leads')
  async getLeads(@Param('id') id: string): Promise<Lead[]> {
    return await this.campaignService.getLeads(id);
  }

  @Get(':id/emails')
  async getEmails(@Param('id') id: string): Promise<LeadBridge[]> {
    return await this.campaignService.getLeadsWithEmails(id);
  }

  @Get(':id/generate-emails')
  async generateEmails(@Param('id') id: string) {
    return this.campaignService.generateEmails(id);
  }
}
