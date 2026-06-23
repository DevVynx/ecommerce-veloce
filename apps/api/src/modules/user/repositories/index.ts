import { createAddress } from "./createAddress";
import { deleteAddress } from "./deleteAddress";
import { findByAddressId } from "./findByAddressId";
import { findManyByUserId } from "./findManyByUserId";
import { setDefaultAddress } from "./setDefaultAddress";
import { update } from "./update";

export const addressRepositories = {
  findManyByUserId,
  findByAddressId,
  createAddress,
  update,
  deleteAddress,
  setDefaultAddress,
};
