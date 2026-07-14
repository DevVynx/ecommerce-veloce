import { changePassword } from "./changePassword";
import { createAddress } from "./createAddress";
import { createUser } from "./createUser";
import { deleteAccount } from "./deleteAccount";
import { deleteAddress } from "./deleteAddress";
import { findAddressById } from "./findAddressById";
import { findAddresses } from "./findAddresses";
import { findUserByEmail } from "./findUserByEmail";
import { findUserByEmailWithPassword } from "./findUserByEmailWithPassword";
import { findUserById } from "./findUserById";
import { getProfile } from "./getProfile";
import { searchCustomers } from "./searchCustomers";
import { setDefault } from "./setDefault";
import { updateAddress } from "./updateAddress";
import { updateProfile } from "./updateProfile";
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
  changePassword,
  deleteAccount,
  updateProfile,
  searchCustomers,
};
