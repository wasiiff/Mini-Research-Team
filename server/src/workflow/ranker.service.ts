import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Doc, DocDocument } from '../docs/schemas/docs.schema';

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function termFreq(tokens: string[]) {
  const tf: Record<string, number> = {};
  tokens.forEach(t => (tf[t] = (tf[t] || 0) + 1));
  return tf;
}

function dotProduct(a: Record<string, number>, b: Record<string, number>) {
  let s = 0;
  for (const k in a) {
    if (b[k]) s += a[k] * b[k];
  }
  return s;
}

function norm(vec: Record<string, number>) {
  let s = 0;
  for (const k in vec) s += vec[k] * vec[k];
  return Math.sqrt(s);
}

@Injectable()
export class RankerService {
  constructor(@InjectModel(Doc.name) private docModel: Model<DocDocument>) {}

  async findAndRank(query: string, topK = 5) {
    const tokens = Array.from(new Set(tokenize(query)));

    // Stronger filter: prioritize title matches
    const candidates = await this.docModel.find({
      $or: [
        { title: { $regex: tokens.join('|'), $options: 'i' } },
        { content: { $regex: tokens.join('|'), $options: 'i' } },
      ],
    }).lean().exec();

    const docs = candidates.length ? candidates : await this.docModel.find().lean().exec();

    // Build TF-IDF vectors
    const allDocsTokens = docs.map(d => tokenize(d.content + ' ' + d.title.repeat(3))); // boost title ×3
    const docTfs = allDocsTokens.map(termFreq);

    const vocab: Record<string, number> = {};
    allDocsTokens.forEach(tokens => {
      new Set(tokens).forEach(t => (vocab[t] = (vocab[t] || 0) + 1));
    });

    const N = docs.length;
    const idf: Record<string, number> = {};
    Object.keys(vocab).forEach(k => (idf[k] = Math.log(1 + N / (vocab[k] || 1))));

    const docVectors = docTfs.map(tf => {
      const vec: Record<string, number> = {};
      for (const term in tf) vec[term] = tf[term] * (idf[term] || 0);
      return vec;
    });

    // Query vector
    const qTf = termFreq(tokens);
    const qVec: Record<string, number> = {};
    for (const t of Object.keys(qTf)) {
      qVec[t] = qTf[t] * (idf[t] || Math.log(1 + N));
    }

    // Scoring
    const scored = docs
      .map((d, i) => {
        const score = (dotProduct(qVec, docVectors[i]) / (norm(qVec) * norm(docVectors[i]) || 1)) || 0;
        return { doc: d, score };
      })
      .filter(r => r.score > 0.01) // drop unrelated docs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }
}
