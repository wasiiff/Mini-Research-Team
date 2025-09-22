import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doc, DocSchema } from '../docs/schemas/docs.schema';
import { WorkflowService } from './workflow.service';
import { SplitterService } from './splitter.service';
import { RankerService } from './ranker.service';
import { SummarizerService } from './summarizer.service';
import { CrosscheckerService } from './crosschecker.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Doc.name, schema: DocSchema }])],
  providers: [WorkflowService, SplitterService, RankerService, SummarizerService, CrosscheckerService, GeminiService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
