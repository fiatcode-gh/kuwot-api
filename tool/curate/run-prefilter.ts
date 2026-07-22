import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
import { prefilter, type RawQuote } from './prefilter.ts';

const dbPath = process.argv[2];
const outPath = process.argv[3];

if (!dbPath || !outPath) {
  console.error(
    'usage: node tool/curate/run-prefilter.ts <db-path> <out-path>'
  );
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db.prepare('SELECT quote, author FROM quotes').all() as RawQuote[];
db.close();

const cleaned = prefilter(rows);
writeFileSync(outPath, JSON.stringify(cleaned));
console.log(`raw=${rows.length} clean=${cleaned.length}`);
