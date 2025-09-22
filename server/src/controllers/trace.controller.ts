import { Controller, Get, Param } from '@nestjs/common';
import { WorkflowService } from '../workflow/workflow.service';

@Controller('trace')
export class TraceController {
  constructor(private workflow: WorkflowService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.workflow.getTrace(id);
  }
}
