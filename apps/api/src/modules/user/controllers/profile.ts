import type { RequestHandler, Response } from "express";

import { userServices } from "@/modules/user/services";

export const profile: RequestHandler = async (_req, res: Response) => {
  const { userId } = res.locals.user;

  const { user } = await userServices.getProfile({ userId });

  res.json({ user });
};
