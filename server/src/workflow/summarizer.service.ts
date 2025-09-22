import { Injectable } from '@nestjs/common';

/**
 * Extractive summarizer: split into sentences and score sentences by
 * overlap with high-weight words (TF-like).
 */
function splitSentences(text: string) {
  // naive sentence splitter
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function tokenizeWords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

@Injectable()
export class SummarizerService {
  // summarize a document: return top n sentences
  summarize(doc: { title: string; content: string }, maxSentences = 3) {
    const sentences = splitSentences(doc.content);
    if (sentences.length <= maxSentences) return { summary: sentences.join(' '), sentences };

    const words = tokenizeWords(doc.content);
    const freq: Record<string, number> = {};
    words.forEach(w => (freq[w] = (freq[w] || 0) + 1));

    // score sentences
    const scored = sentences.map(s => {
      const toks = tokenizeWords(s);
      let score = 0;
      toks.forEach(t => {
        score += freq[t] || 0;
      });
      // longer sentences normalized slightly
      score = score / (1 + Math.log(1 + toks.length));
      return { s, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, maxSentences).sort((a, b) => doc.content.indexOf(a.s) - doc.content.indexOf(b.s));
    const summary = selected.map(x => x.s).join(' ');
    return { summary, sentences: selected.map(x => x.s) };
  }
}
