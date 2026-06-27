import type { DeleteAddressResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { userServices } from "@/modules/user/services";
import v from "@/modules/user/validators";

export const deleteAddress: RequestHandler = async (req, res: Response<DeleteAddressResponse>) => {
  const { userId } = res.locals.user;

  const { addressId } = v.deleteAddress.getValidatedValues(req).params;

  await userServices.deleteAddress({ userId, addressId });

  return res.status(204).send();
};
