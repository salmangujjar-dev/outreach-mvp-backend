import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PersonaController } from './persona.controller';
import { Persona, PersonaSchema } from './persona.schema';
import { PersonaService } from './persona.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Persona.name, schema: PersonaSchema }]),
  ],
  providers: [PersonaService],
  controllers: [PersonaController],
})
export class PersonaModule {}
