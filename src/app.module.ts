import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignController } from './campaign/campaign.controller';
import { CampaignModule } from './campaign/campaign.module';
import { PersonaModule } from './persona/persona.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/Outreach_MVP'),
    PersonaModule,
    CampaignModule,
  ],
  controllers: [AppController, CampaignController],
  providers: [AppService],
})
export class AppModule {}
