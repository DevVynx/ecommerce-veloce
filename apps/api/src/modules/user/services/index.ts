import { createAddress } from "./createAddress";
import { deleteAddress } from "./deleteAddress";
import { findAddressById } from "./findAddressById";
import { findAddresses } from "./findAddresses";
import { getProfile } from "./getProfile";
import { setDefault } from "./setDefault";
import { updateAddress } from "./updateAddress";

export const userServices = {
  findAddressById,
  findAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefault,
  getProfile,
};
