module.exports = {
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB || 'db',
  POSTGRES_USER: process.env.POSTGRES_USER || 'user',
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'password',
  SALT_ROUNDS: 10,
  JWT_PASSPHRASE: process.env.JWT_PASSPHRASE || 'passphrase',
  JWT_ISSUER: process.env.JWT_ISSUER || 'btc-backend',
  JWT_EXP: '7d'
};
