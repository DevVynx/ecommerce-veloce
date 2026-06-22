import z from "zod";

import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  term: z.string().trim().min(1, "Termo é obrigatório."),
});

export const registerAnalytics = validation({ body });
