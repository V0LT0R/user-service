import 'dotenv/config';

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Env var ${name} is required`);
  return value;
}

// строка вида "1h", "30m", "15s", "7d", "1000ms", либо просто число секунд
type JwtTimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y';
type JwtTimeString = `${number}${JwtTimeUnit}`;
export type JwtExpires = number | JwtTimeString;

function parseJwtExpires(v?: string): JwtExpires {
  if (!v || v.trim() === '') return '1h';
  if (/^\d+$/.test(v)) return Number(v);                         // "3600"
  if (/^\d+(ms|s|m|h|d|w|y)$/.test(v)) return v as JwtTimeString; // "1h", "30m", ...
  throw new Error('JWT_EXPIRES_IN must be a number of seconds or like 1h, 30m, 15s');
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: required('JWT_SECRET', process.env.JWT_SECRET),
  JWT_EXPIRES_IN: parseJwtExpires(process.env.JWT_EXPIRES_IN)
};
