import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from '@google/generative-ai';

config();

@Injectable()
export class GeminiService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async ask(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });

    const result: GenerateContentResult = await model.generateContent(prompt);

    return result.response.text();
  }
}
