import { getAll } from "./getAll";
import { getById } from "./getById";
import { getBySlug } from "./getBySlug";
import { searchAdmin } from "./searchAdminProducts";
import { searchProducts } from "./searchProducts";

const validations = { getAll, getById, getBySlug, searchAdmin, searchProducts };

export default validations;
