import type { NextFunction, Request, Response } from 'express';
import { Auth } from './auth.js';
import { AuthPayload } from './types.js';

const auth = new Auth();

export function bearerAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const token = authHeader.substring('Bearer '.length);
    const decrypted = auth.decryptToken(token);
    if (!decrypted) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const payload: AuthPayload = JSON.parse(decrypted);
    if (!payload.token || typeof payload.issuedAt !== 'number') {
      return res.status(401).json({ error: 'Token payload missing fields' });
    }
    if (!auth.isTokenValid(payload.token)) {
      return res.status(401).json({ error: 'Token is not a valid UUID' });
    }
    if (auth.isTokenExpired(payload.issuedAt)) {
      return res.status(401).json({ error: 'Token expired' });
    }
    next();
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
