import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowService } from '../workflow/workflow.service';

@Controller('ask')
export class AskController {
  constructor(private workflow: WorkflowService) {}

  @Post()
  async ask(@Body() payload: { question: string }) {
    if (!payload?.question) return { error: 'question required' };
    const result = await this.workflow.runWorkflow(payload.question);
    return result;
  }
}
