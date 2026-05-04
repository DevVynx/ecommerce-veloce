export const formatCep = (value: string): string => {
  // Remove tudo que não é número
  const onlyNumbers = value.replace(/\D/g, "");

  // Formata: 12345678 → 12345-678
  if (onlyNumbers.length <= 5) {
    return onlyNumbers;
  }
  return `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(5, 8)}`;
};
