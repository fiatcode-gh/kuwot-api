import 'dotenv/config';
import express from 'express';
import {
  onGetImages,
  onGetQuoteById,
  onGetRandomQuote,
  onGetTranslations,
} from './routes.js';

const app = express();

app.get('/quotes/random', onGetRandomQuote);
app.get('/quotes/:id', onGetQuoteById);
app.get('/translations', onGetTranslations);
app.get('/images', onGetImages);

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
