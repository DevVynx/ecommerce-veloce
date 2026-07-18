function getEnvOrThrow(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Env ${name} está vazio ou não definido`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: getEnvOrThrow("NODE_ENV", process.env.NODE_ENV),
  NEXT_PUBLIC_API_URL: getEnvOrThrow("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),

  JWT_ACCESS_SECRET:
    typeof window === "undefined"
      ? getEnvOrThrow("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET)
      : (process.env.JWT_ACCESS_SECRET as string),

  GOOGLE_CLIENT_ID:
    typeof window === "undefined"
      ? getEnvOrThrow("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)
      : (process.env.GOOGLE_CLIENT_ID as string),
} as const;
