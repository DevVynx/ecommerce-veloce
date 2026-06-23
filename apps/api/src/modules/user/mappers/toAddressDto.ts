import type { AddressDto } from "@repo/types/contracts";

import type { Prisma } from "../../../../prisma/generated/client/client";

type AddressRaw = Prisma.AddressGetPayload<object>;

export const toAddressDto = (raw: AddressRaw): AddressDto => ({
  id: raw.id,
  receiverName: raw.receiverName,
  label: raw.label,
  cep: raw.cep,
  street: raw.street,
  number: raw.number,
  complement: raw.complement,
  neighborhood: raw.neighborhood,
  city: raw.city,
  state: raw.state,
  isDefault: raw.isDefault,
});
