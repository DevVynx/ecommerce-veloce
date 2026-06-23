type ViaCepResponse = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

type AddressFromCep = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function fetchAddressByCep(rawCep: string): Promise<AddressFromCep | null> {
  const cep = rawCep.replace(/\D/g, "");
  if (cep.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) return null;

  const data: ViaCepResponse = await response.json();
  if (data.erro) return null;

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  };
}
