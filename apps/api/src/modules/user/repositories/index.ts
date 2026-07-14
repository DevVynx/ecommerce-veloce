import { createAddress } from "./createAddress";
import { createUser } from "./createUser";
import { deleteAddress } from "./deleteAddress";
import { deleteUser } from "./deleteUser";
import { findAddressById } from "./findAddressById";
import { findAddressesByUserId } from "./findAddressesByUserId";
import { findUserByEmail } from "./findUserByEmail";
import { findUserByEmailWithPassword } from "./findUserByEmailWithPassword";
import { findUserById } from "./findUserById";
import { findUserByIdWithPassword } from "./findUserByIdWithPassword";
import { findUserProfile } from "./findUserProfile";
import { searchCustomers } from "./searchCustomers";
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
  deleteUser,
  setDefaultAddress,
  findUserProfile,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  findUserByIdWithPassword,
  searchCustomers,
};
