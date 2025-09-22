export interface WorkflowStep {
  name: string;
  description: string;
  data?: string | Record<string, unknown> | unknown[];
}


export interface WorkflowTrace {
  id: string;
  question: string;
  steps: WorkflowStep[];
  createdAt: string;
  finalAnswer: string;
}

export interface AskResponse {
  id: string;
  trace: WorkflowTrace;
}
