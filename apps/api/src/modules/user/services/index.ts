import { createAddress } from "./createAddress";
import { deleteAddress } from "./deleteAddress";
import { listAddresses } from "./listAddresses";
import { setDefault } from "./setDefault";
import { updateAddress } from "./updateAddress";

export const addressServices = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefault,
};
