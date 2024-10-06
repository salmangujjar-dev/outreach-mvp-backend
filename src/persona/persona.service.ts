import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePersonaDto, UpdatePersonaDto } from './persona.dto';
import { Persona, PersonaDocument } from './persona.schema';

@Injectable()
export class PersonaService {
  constructor(
    @InjectModel(Persona.name) private personaModel: Model<PersonaDocument>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const createdPersona = new this.personaModel(createPersonaDto);
    return createdPersona.save();
  }

  async findAll(): Promise<Persona[]> {
    return this.personaModel.find().exec();
  }

  async findOne(id: string): Promise<Persona> {
    return this.personaModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<Persona> {
    return this.personaModel
      .findByIdAndUpdate(id, updatePersonaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Persona> {
    return this.personaModel.findByIdAndDelete(id).exec();
  }
}
