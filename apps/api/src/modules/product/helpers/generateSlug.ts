export function generateSlug(title: string): string {
  const base = title
    .toLowerCase() // 1. Converte tudo para minúsculas
    .normalize("NFD") // 2. Separa os acentos das letras (Decomposition)
    .replace(/[\u0300-\u036f]/g, "") // 3. Remove os acentos isolados
    .replace(/[^a-z0-9\s-]/g, "") // 4. Remove caracteres especiais (mantém apenas letras, números, espaços e hifens)
    .replace(/[\s-]+/g, "-") // 5. Troca espaços e hifens repetidos por um único hífen (-)
    .replace(/^-+|-+$/g, ""); // 6. Remove hifens que sobraram nas pontas (início e fim)

  const randomId = Math.random().toString(36).slice(2, 10);

  return `${base}-${randomId}`;
}
