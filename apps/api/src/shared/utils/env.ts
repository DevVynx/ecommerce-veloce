export function getEnvOrThrow(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Env ${name} está vazio ou não definido`);
  }

  return value;
}

export const ENV = {
  NODE_ENV: getEnvOrThrow("NODE_ENV"),
  PORT: getEnvOrThrow("PORT"),
  DATABASE_URL: getEnvOrThrow("DATABASE_URL"),
  IP_ADDRESS: getEnvOrThrow("IP_ADDRESS"),
  SHIPPING_ORIGIN_CEP: getEnvOrThrow("SHIPPING_ORIGIN_CEP"),
  JWT_ACCESS_SECRET: getEnvOrThrow("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnvOrThrow("JWT_REFRESH_SECRET"),
  GOOGLE_CLIENT_ID: getEnvOrThrow("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvOrThrow("GOOGLE_CLIENT_SECRET"),
  MEILI_HOST: getEnvOrThrow("MEILI_HOST"),
  MEILI_MASTER_KEY: getEnvOrThrow("MEILI_MASTER_KEY"),
  STRIPE_SECRET_KEY: getEnvOrThrow("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: getEnvOrThrow("STRIPE_WEBHOOK_SECRET"),
  FRONTEND_URL: getEnvOrThrow("FRONTEND_URL"),
};
