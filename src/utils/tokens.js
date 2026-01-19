import crypto from 'crypto';

export const createPasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60);
  return { token, tokenHash, expires };
};
