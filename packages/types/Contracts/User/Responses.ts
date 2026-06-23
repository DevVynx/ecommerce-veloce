export type AddressDto = {
  id: string;
  receiverName: string;
  label: string | null;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export type CreateAddressResponse = { address: AddressDto };

export type ListAddressesResponse = { addresses: AddressDto[] };

export type UpdateAddressResponse = { address: AddressDto };

export type DeleteAddressResponse = void;

export type SetDefaultAddressResponse = { address: AddressDto };
