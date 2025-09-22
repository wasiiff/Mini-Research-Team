// in workflow/crosschecker.service.ts
import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Injectable()
export class CrosscheckerService {
  constructor(private gemini: GeminiService) {}

  async checkWithGemini(summaries: { docId?: any; title?: string; summary: string }[]): Promise<{ contradictions: string[] }> {
    // Build prompt
    const promptParts = summaries.map(s => `Document "${s.title}": ${s.summary}`);
    const prompt = `
You are a fact-checker. Here are summaries of different documents in response to a question.  
${promptParts.join('\n\n')}

Question: Do any of these summaries contradict each other?  
If yes, for each contradiction, describe what the conflict is, which documents are involved.  
If no, say there are no contradictions.
`;

    const geminiResp = await this.gemini.ask(prompt);
    // parse the response (could be text). For simplicity, you can just return the text
    return { contradictions: [geminiResp] };
  }
}
