import { config } from 'dotenv';
config();
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_research';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const docs = db.collection('docs');

  const seedDir = path.resolve(__dirname, '../../seed_docs');
  const files = fs.readdirSync(seedDir).filter(f => f.endsWith('.txt'));
  const docsToInsert = files.map(f => {
    const content = fs.readFileSync(path.join(seedDir, f), 'utf-8');
    // filename like databases_sql_1.txt -> topic guess
    const parts = f.split('_');
    const topic = parts[0] || 'General';
    return {
      title: f.replace('.txt', '').replace(/_/g, ' '),
      topic,
      content,
      createdAt: new Date().toISOString()
    };
  });
  await docs.insertMany(docsToInsert);
  console.log('Inserted', docsToInsert.length, 'documents');
  await client.close();
}
run().catch(err => { console.error(err); process.exit(1); });
