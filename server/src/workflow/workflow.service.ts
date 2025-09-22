import { Injectable } from '@nestjs/common';
import { SplitterService } from './splitter.service';
import { RankerService } from './ranker.service';
import { SummarizerService } from './summarizer.service';
import { GeminiService } from './gemini.service';
import { InjectModel } from '@nestjs/mongoose';
import { Doc, DocDocument } from '../docs/schemas/docs.schema';
import { Model } from 'mongoose';
import { WorkflowTrace } from '../common/interfaces';

@Injectable()
export class WorkflowService {
  private traces: Record<string, WorkflowTrace> = {}; // simple in-memory store (can also persist to DB)

  constructor(
    private splitter: SplitterService,
    private ranker: RankerService,
    private summarizer: SummarizerService,
    private gemini: GeminiService, // ✅ added Gemini
    @InjectModel(Doc.name) private docModel: Model<DocDocument>
  ) {}

  async runWorkflow(question: string) {
    const trace: WorkflowTrace = {
      question,
      steps: [],
      createdAt: new Date(),
      finalAnswer: '',
    };

    // Step 1: Split question
    const subquestions = this.splitter.split(question);
    trace.steps.push({
      name: 'Question Splitter',
      description: 'Split into sub-questions',
      data: subquestions,
    });

    // Step 2 + Step 3 + Step 4
    const allSummaries: any[] = [];
    const usedDocs: any[] = [];

    for (const sq of subquestions) {
      trace.steps.push({
        name: 'Document Finder',
        description: `Find docs matching "${sq}"`,
      });

      const ranked = await this.ranker.findAndRank(sq, 4);

      trace.steps.push({
        name: 'Ranker',
        description: `Top docs for "${sq}"`,
        data: ranked.map((r) => ({
          id: r.doc._id,
          title: r.doc.title,
          score: r.score,
        })),
      });

      const summariesForSub: any[] = [];
      for (const r of ranked) {
        const summ = this.summarizer.summarize(
          { title: r.doc.title, content: r.doc.content },
          3
        );
        summariesForSub.push({
          docId: r.doc._id,
          title: r.doc.title,
          score: r.score,
          summary: summ.summary,
        });
        usedDocs.push({ id: r.doc._id, title: r.doc.title, score: r.score });
      }

      trace.steps.push({
        name: 'Summarizer',
        description: `Summaries for "${sq}"`,
        data: summariesForSub,
      });

      allSummaries.push(...summariesForSub);
    }

    // Step 5: Cross-Checker with Gemini
    const crossCheckPrompt = `
You are a fact-checking assistant. 
Here are summaries from different documents:

${allSummaries.map((s) => `- (${s.title}): ${s.summary}`).join('\n')}

Task: Check if any contradictions exist between these summaries. 
Return a clear explanation of contradictions (if any). 
If none, say "No contradictions."
    `;

    const contradictionsText = await this.gemini.ask(crossCheckPrompt);

    trace.steps.push({
      name: 'Cross-Checker (Gemini)',
      description: 'Gemini cross-checked summaries for contradictions',
      data: contradictionsText,
    });

    // Step 6: Final Answer Maker with Gemini
    const finalPrompt = `
The user asked: "${question}"

Sub-questions:
${subquestions.map((sq, i) => `${i + 1}. ${sq}`).join('\n')}

Here are the top summaries:
${allSummaries
  .map((s) => `From "${s.title}" (score ${s.score}): ${s.summary}`)
  .join('\n')}

Your job:
1. Write a clear, concise, and well-structured final answer. 
2. Integrate information from all summaries.
3. Mention contradictions if any were detected earlier.
    `;

    const finalAnswer = await this.gemini.ask(finalPrompt);

    trace.steps.push({
      name: 'Final Answer (Gemini)',
      description: 'Gemini synthesized the final answer',
      data: finalAnswer,
    });

    trace.finalAnswer = finalAnswer;

    // Save trace with ID
    const id = `${Date.now()}`;
    trace.id = id;
    this.traces[id] = trace;

    return { id, trace };
  }

  getTrace(id: string) {
    return this.traces[id] || null;
  }
}
