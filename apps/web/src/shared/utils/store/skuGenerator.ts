function abbreviate(word: string, maxLength = 4): string {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, maxLength)
    .toUpperCase();
}

// Gera um hash de 4 caracteres baseado no texto cheio (Não muda no re-render)
function generateShortHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Força a conversão para um inteiro de 32-bits
  }
  // Converte para base36 (letras e números) e pega 4 caracteres
  return Math.abs(hash).toString(36).toUpperCase().padEnd(4, "0").slice(0, 4);
}

export function generateSku(name: string, attributes: Record<string, string>): string {
  // Garante que os atributos venham SEMPRE na mesma ordem (ex: Cor depois Tamanho)
  const sortedKeys = Object.keys(attributes).sort();
  const attrParts = sortedKeys.map((key) => {
    const val = attributes[key];
    return abbreviate(val ?? "");
  });

  // Cria uma "semente" única usando o nome completo e atributos completos
  const fullAttrString = sortedKeys.map((key) => `${key}:${attributes[key]}`).join("|");
  const uniqueSeed = `${name.trim()}|${fullAttrString}`;

  // Gera o identificador único para esse produto
  const uniqueId = generateShortHash(uniqueSeed);

  // Monta o SKU final:ex: CAMI-AZUL-P-K3F9
  const parts = [abbreviate(name), ...attrParts, uniqueId];
  return parts.join("-");
}
