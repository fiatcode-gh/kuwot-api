import { constants, createPrivateKey, privateDecrypt } from 'crypto';
import * as fs from 'fs';
import { validate as validateUUID } from 'uuid';

/**
 * Simple auth implementation using RSA.
 * Client sends a base64 UUID encrypted with public key, server decrypts with private key and checks validity.
 */
export class Auth {
  constructor() {}

  decryptToken(token: string): string {
    const keyPem = fs.readFileSync('auth_key.pem', 'utf-8');
    const privateKey = createPrivateKey({ key: keyPem, format: 'pem' });
    const encryptedBuffer = Buffer.from(token, 'base64');
    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      encryptedBuffer
    );
    return decrypted.toString('utf-8');
  }

  isTokenValid(decryptedToken: string): boolean {
    return validateUUID(decryptedToken);
  }

  isTokenExpired(issuedAt: number): boolean {
    const tokenLifetimeSeconds = 300;
    const allowedDriftSeconds = 10;
    const now = Math.floor(Date.now() / 1000); // current unix timestamp in seconds
    const diff = now - issuedAt;
    return (
      diff < -allowedDriftSeconds ||
      diff > tokenLifetimeSeconds + allowedDriftSeconds
    );
  }
}
