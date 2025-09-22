import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('run')
  async run(@Body('question') question: string) {
    return this.workflowService.runWorkflow(question);
  }

  @Get('trace/:id')
  async getTrace(@Param('id') id: string) {
    return this.workflowService.getTrace(id);
  }
}
