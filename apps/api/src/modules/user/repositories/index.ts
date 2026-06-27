import { createAddress } from "./createAddress";
import { deleteAddress } from "./deleteAddress";
import { findAddressById } from "./findAddressById";
import { findAddressesByUserId } from "./findAddressesByUserId";
import { findUserProfile } from "./findUserProfile";
import { setDefaultAddress } from "./setDefaultAddress";
import { updateAddress } from "./updateAddress";

export const userRepositories = {
  findAddressesByUserId,
  findAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  findUserProfile,
};
