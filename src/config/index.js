const POSTGRES_HOST = process.env.POSTGRES_HOST || 'postgres';
const POSTGRES_DB = process.env.POSTGRES_DB || 'db';
const POSTGRES_USER = process.env.POSTGRES_USER || 'user';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';

module.exports = {
  SALT_ROUNDS: 10,
  JWT_PASSPHRASE: process.env.JWT_PASSPHRASE || 'passphrase',
  JWT_ISSUER: process.env.JWT_ISSUER || 'btc-backend',
  JWT_EXP: '7d',
  DATABASE_URL: process.env.DATABASE_URL || `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
};
