import { createAddress } from "./createAddress";
import { createUser } from "./createUser";
import { deleteAddress } from "./deleteAddress";
import { findAddressById } from "./findAddressById";
import { findAddresses } from "./findAddresses";
import { findUserByEmail } from "./findUserByEmail";
import { findUserByEmailWithPassword } from "./findUserByEmailWithPassword";
import { findUserById } from "./findUserById";
import { getProfile } from "./getProfile";
import { setDefault } from "./setDefault";
import { updateAddress } from "./updateAddress";
import { updateUserById } from "./updateUserById";

export const userServices = {
  findAddressById,
  findAddresses,
  createAddress,
  createUser,
  updateAddress,
  updateUserById,
  deleteAddress,
  setDefault,
  getProfile,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
};
