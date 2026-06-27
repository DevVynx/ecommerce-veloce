import type { UpdateAddressResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { toAddressDto } from "@/modules/user/mappers";
import { userServices } from "@/modules/user/services";
import v from "@/modules/user/validators";

export const updateAddress: RequestHandler = async (req, res: Response<UpdateAddressResponse>) => {
  const { userId } = res.locals.user;

  const { addressId } = v.updateAddress.getValidatedValues(req).params;
  const data = v.updateAddress.getValidatedValues(req).body;

  const { address } = await userServices.updateAddress({ userId, addressId, ...data });
  const mapped = toAddressDto(address);

  return res.status(200).json({ address: mapped });
};
