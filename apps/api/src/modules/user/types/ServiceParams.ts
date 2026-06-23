import type { CreateAddressRequest, UpdateAddressRequest } from "@repo/types/contracts";

export type ListAddressesParams = { userId: string };

export type CreateAddressParams = { userId: string } & CreateAddressRequest;

export type UpdateAddressParams = { userId: string } & UpdateAddressRequest;

export type DeleteAddressParams = { userId: string; addressId: string };

export type SetDefaultAddressParams = { userId: string; addressId: string };
