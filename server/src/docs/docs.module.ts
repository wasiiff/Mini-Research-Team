import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doc, DocSchema } from './schemas/docs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doc.name, schema: DocSchema }])
  ],
  exports: [MongooseModule]
})
export class DocsModule {}
