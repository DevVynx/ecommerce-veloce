import type { SetDefaultAddressResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { toAddressDto } from "@/modules/user/mappers";
import { addressServices } from "@/modules/user/services";
import v from "@/modules/user/validators";

export const setDefault: RequestHandler = async (req, res: Response<SetDefaultAddressResponse>) => {
  const { userId } = res.locals.user;

  const { addressId } = v.setDefault.getValidatedValues(req).params;

  const { address } = await addressServices.setDefault({ userId, addressId });
  const mapped = toAddressDto(address);

  return res.json({ address: mapped });
};
