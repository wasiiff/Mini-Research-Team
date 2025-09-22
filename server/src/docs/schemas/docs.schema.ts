import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema({ timestamps: true })
export class Doc {
  @Prop({ required: true }) title: string;
  @Prop({ index: true }) topic: string;
  @Prop({ required: true }) content: string;
  @Prop() source?: string;
  @Prop() createdAt?: string;
  @Prop({ type: Map, of: String })
  metadata?: Record<string, any>;
}

export const DocSchema = SchemaFactory.createForClass(Doc);
