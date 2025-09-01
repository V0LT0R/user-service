import 'dotenv/config';

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Env var ${name} is required`);
  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: required('JWT_SECRET', process.env.JWT_SECRET),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};
