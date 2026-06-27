import type { CreateAddressResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { toAddressDto } from "@/modules/user/mappers";
import { userServices } from "@/modules/user/services";
import v from "@/modules/user/validators";

export const createAddress: RequestHandler = async (req, res: Response<CreateAddressResponse>) => {
  const { userId } = res.locals.user;

  const data = v.createAddress.getValidatedValues(req).body;

  const { address } = await userServices.createAddress({ userId, ...data });
  const mapped = toAddressDto(address);

  return res.status(201).json({ address: mapped });
};
