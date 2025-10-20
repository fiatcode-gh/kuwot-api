import type { Request, Response } from 'express';
import { getQuote, getRandomQuote, listTranslations } from './data/quote.js';
import { listRandomImages } from './data/unsplash.js';

function onGetRandomQuote(req: Request, res: Response): void {
  const langQuery = (req.query['lang'] as string) ?? 'en';
  try {
    const quote = getRandomQuote(langQuery);
    res.status(200).send(quote);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

function onGetQuoteById(req: Request, res: Response): void {
  const langQuery = (req.query['lang'] as string) ?? 'en';
  const idParam = req.params['id'];
  if (!idParam) {
    res.status(400).send({ error: 'Quote ID is required.' });
    return;
  }

  try {
    const id = parseInt(idParam);
    const quote = getQuote(id, langQuery);
    res.status(200).send(quote);
  } catch (e) {
    res.status(500).send({ error: (e as Error).message });
  }
}

function onGetTranslations(_req: Request, res: Response): void {
  try {
    const translations = listTranslations();
    res.status(200).send(translations);
  } catch (e) {
    res.status(500).send({ error: (e as Error).message });
  }
}

async function onGetImages(_req: Request, res: Response): Promise<void> {
  try {
    const images = await listRandomImages();
    res.status(200).send(images);
  } catch (e) {
    res.status(500).send({ error: (e as Error).message });
  }
}

export { onGetImages, onGetQuoteById, onGetRandomQuote, onGetTranslations };
