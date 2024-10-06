import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PersonaDocument = Persona & Document;

@Schema()
class ICPQuestions {
  @Prop()
  usp: string;

  @Prop()
  industry: string;

  @Prop()
  customerSupport: string;
}

@Schema({ collection: 'Persona' })
export class Persona {
  @Prop({ required: true })
  name: string;

  @Prop({ type: ICPQuestions, required: true })
  icpQuestions: ICPQuestions;
}
export const PersonaSchema = SchemaFactory.createForClass(Persona);
