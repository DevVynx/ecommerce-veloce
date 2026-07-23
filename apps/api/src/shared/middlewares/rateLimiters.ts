import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições." },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas de autenticação. Tente novamente em 10 minutos." },
});

export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas de checkout. Aguarde." },
});

export const shippingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20,
  message: { error: "Muitas consultas de frete. Aguarde um instante." },
});

export const couponLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10,
  message: { error: "Muitas tentativas de validação de cupom." },
});

export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  message: { error: "Muitas buscas realizadas. Aguarde alguns segundos." },
});
