export type AddressInput = {
  receiverName: string;
  label?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type CreateAddressRequest = AddressInput;

export type UpdateAddressRequest = Partial<AddressInput> & {
  addressId: string;
};

export type SetDefaultAddressRequest = { addressId: string };
