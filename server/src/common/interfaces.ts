export interface TraceStep {
  name: string;
  description?: string;
  data?: any;
}
export interface WorkflowTrace {
  id?: string;
  question: string;
  steps: TraceStep[];
  createdAt?: Date;
  finalAnswer?: string;
}
