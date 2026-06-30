import { createAddress } from "./createAddress";
import { createUser } from "./createUser";
import { deleteAddress } from "./deleteAddress";
import { findAddressById } from "./findAddressById";
import { findAddressesByUserId } from "./findAddressesByUserId";
import { findUserByEmail } from "./findUserByEmail";
import { findUserByEmailWithPassword } from "./findUserByEmailWithPassword";
import { findUserById } from "./findUserById";
import { findUserProfile } from "./findUserProfile";
import { setDefaultAddress } from "./setDefaultAddress";
import { updateAddress } from "./updateAddress";
import { updateUserById } from "./updateUserById";

export const userRepositories = {
  findAddressesByUserId,
  findAddressById,
  createAddress,
  createUser,
  updateAddress,
  updateUserById,
  deleteAddress,
  setDefaultAddress,
  findUserProfile,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
};
