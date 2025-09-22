import { Controller, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc } from '../docs/schemas/docs.schema';

@Controller('upload')
export class UploadController {
  constructor(@InjectModel(Doc.name) private docModel: Model<Doc>) {}

  @Post()
  async upload(@Body() payload: { title: string; topic: string; content: string; source?: string }) {
    const created = new this.docModel({
      ...payload,
      createdAt: new Date().toISOString()
    });
    await created.save();
    return { ok: true, id: created._id };
  }
}
