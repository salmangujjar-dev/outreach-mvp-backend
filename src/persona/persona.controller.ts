import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { CreatePersonaDto, UpdatePersonaDto } from './persona.dto';
import { PersonaService } from './persona.service';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  async create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  async findAll() {
    return this.personaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.personaService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonaDto: UpdatePersonaDto,
  ) {
    return this.personaService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.personaService.remove(id);
  }
}
