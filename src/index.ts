import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  onGetImages,
  onGetQuoteById,
  onGetRandomQuote,
  onGetTranslations,
} from './routes.js';

const app = express();

const hourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again in an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

const burstLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 50,
  message: 'Slow down! Too many requests',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(hourlyLimiter);
app.use(burstLimiter);

app.get('/quotes/random', onGetRandomQuote);
app.get('/quotes/:id', onGetQuoteById);
app.get('/translations', onGetTranslations);
app.get('/images', onGetImages);

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
