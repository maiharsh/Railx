import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'railx_secret_key_2024';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: any): string {
  const options: SignOptions = { expiresIn: `7d` };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  try {
    const options: VerifyOptions = {};
    return jwt.verify(token, JWT_SECRET, options);
  } catch (error) {
    return null;
  }
}
