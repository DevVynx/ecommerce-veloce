import type { CreateAddressRequest, UpdateAddressRequest } from "@repo/types/contracts";

import type { Prisma } from "../../../../prisma/generated/client/client";

export type FindAddressByIdParams = { addressId: string };

export type FindAddressesParams = { userId: string };

export type CreateAddressParams = { userId: string } & CreateAddressRequest;

export type UpdateAddressParams = { userId: string } & UpdateAddressRequest;

export type DeleteAddressParams = { userId: string; addressId: string };

export type SetDefaultAddressParams = { userId: string; addressId: string };

export type CreateUserParams = { data: Prisma.UserCreateInput };

export type FindUserByEmailParams = { email: string };

export type FindUserByEmailWithPasswordParams = { email: string };

export type FindUserByIdParams = { userId: string };

export type UpdateUserByIdParams = { userId: string; data: Prisma.UserUpdateInput };
