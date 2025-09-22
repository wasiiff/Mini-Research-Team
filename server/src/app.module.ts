import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocsModule } from './docs/docs.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AskController } from './controllers/ask.controller';
import { UploadController } from './controllers/upload.controller';
import { TraceController } from './controllers/trace.controller';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_research'),
    DocsModule,
    WorkflowModule,
  ],
  controllers: [AskController, UploadController, TraceController],
  providers: [],
})
export class AppModule {}
