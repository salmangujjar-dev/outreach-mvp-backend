import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PersonaDocument = Persona & Document;

@Schema()
class ICPQuestions {
  @Prop({ required: true })
  usp: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true })
  customerSupport: string;
}

@Schema()
export class Persona {
  @Prop({ required: true })
  name: string;

  @Prop({ type: ICPQuestions, required: true })
  icpQuestions: ICPQuestions;
}

export const PersonaSchema = SchemaFactory.createForClass(Persona);
