import { DatabaseSync } from 'node:sqlite';
import type { Quote, Translation } from '../types.js';

const MAX_QUOTE_ID = 250000;
const db = new DatabaseSync('quotes.db');

function getTableNameForLang(langId: string) {
  const translationRow = db
    .prepare(`SELECT table_name FROM translations WHERE id = ?`)
    .get(langId);
  if (!translationRow) {
    throw new Error(`Translation with id ${langId} not found.`);
  }
  return translationRow['table_name'] as string;
}

function getRandomQuote(langId: string): Quote {
  const randomId = Math.floor(Math.random() * MAX_QUOTE_ID) + 1;
  const tableName = getTableNameForLang(langId);
  const quoteRow = db
    .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
    .get(randomId);
  if (!quoteRow) {
    throw new Error(`Quote with id ${randomId} not found.`);
  }
  return {
    id: quoteRow['id'] as number,
    text: quoteRow['quote'] as string,
    author: quoteRow['author'] as string,
  };
}

function getQuote(id: number, langId: string): Quote {
  const tableName = getTableNameForLang(langId);
  const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
  if (!row) {
    throw new Error(`Quote with id ${id} not found.`);
  }
  return {
    id: row['id'] as number,
    text: row['quote'] as string,
    author: row['author'] as string,
  };
}

function listTranslations(): Translation[] {
  const rows = db.prepare(`SELECT * FROM translations`).all();
  return rows.map((row) => {
    return {
      id: row['id'] as number,
      lang: row['lang'] as string,
      tableName: row['table_name'] as string,
    };
  });
}

export { getQuote, getRandomQuote, listTranslations };
