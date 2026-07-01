<<<<<<< HEAD
import { userRepositories } from "@/modules/user/repositories";
import type { UpdateProfileRequest } from "@repo/types/contracts";

=======
import type { UpdateProfileRequest } from "@repo/types/contracts";

import { userRepositories } from "@/modules/user/repositories";

>>>>>>> 2da0003 (refactor(api): standardize barrel exports to use export *)
type UpdateProfileServiceParams = { userId: string } & UpdateProfileRequest;

export const updateProfile = async ({ userId, name, email }: UpdateProfileServiceParams) => {
  const user = await userRepositories.updateUserById({
    userId,
    data: { name, email },
  });

  const { googleId: _, ...userProfile } = user;

  return { user: userProfile };
};
