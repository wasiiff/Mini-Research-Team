import { Injectable } from '@nestjs/common';

@Injectable()
export class SplitterService {
  split(query: string): string[] {
    const q = query.trim().toLowerCase();

    // Pattern: "Compare X vs Y"
    const compareMatch = q.match(/compare\s+(.+)\s+vs\s+(.+)/i);
    if (compareMatch) {
      const x = compareMatch[1].trim();
      const y = compareMatch[2].trim();
      return [
        `What is ${x}?`,
        `What is ${y}?`,
        `What are the similarities and differences between ${x} and ${y}?`,
        `What are the pros and cons of ${x}?`,
        `What are the pros and cons of ${y}?`,
      ];
    }

    // Pattern: "Difference between X and Y"
    const diffMatch = q.match(/difference between (.+) and (.+)/i);
    if (diffMatch) {
      const x = diffMatch[1].trim();
      const y = diffMatch[2].trim();
      return [
        `What is ${x}?`,
        `What is ${y}?`,
        `How does ${x} differ from ${y}?`,
      ];
    }

    // Pattern: "Advantages of X"
    const advMatch = q.match(/advantages of (.+)/i);
    if (advMatch) {
      const x = advMatch[1].trim();
      return [`What is ${x}?`, `What are the advantages of ${x}?`, `What are the disadvantages of ${x}?`];
    }

    // Default fallback: return as single refined question
    return [`${query.charAt(0).toUpperCase()}${query.slice(1)}?`];
  }
}
