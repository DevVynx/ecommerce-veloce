import z from "zod";

export const dateString = () => z.string().refine((s) => !isNaN(Date.parse(s)), "Data inválida.");
