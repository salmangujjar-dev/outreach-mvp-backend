import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';
import { Persona, PersonaSchema } from './persona.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Persona.name, schema: PersonaSchema }]),
  ],
  providers: [PersonaService],
  controllers: [PersonaController],
})
export class PersonaModule {}
