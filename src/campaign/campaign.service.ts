import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TCreateCampaign } from './campaign.dto';
import { Campaign } from './campaign.schema';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
  ) {}

  async create(createCampaignDto: TCreateCampaign): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    return createdCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async findOne(id: string): Promise<Campaign> {
    return this.campaignModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCampaignDto: Partial<TCreateCampaign>,
  ): Promise<Campaign> {
    return this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Campaign> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }
}
