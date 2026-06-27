import type { ListAddressesResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { toAddressDto } from "@/modules/user/mappers";
import { userServices } from "@/modules/user/services";

export const listAddresses: RequestHandler = async (_req, res: Response<ListAddressesResponse>) => {
  const { userId } = res.locals.user;

  const { addresses } = await userServices.findAddresses({ userId });
  const mapped = addresses.map(toAddressDto);

  return res.json({ addresses: mapped });
};
