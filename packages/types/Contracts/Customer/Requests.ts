export type AdminGetCustomersRequest = {
  q?: string;
  sortBy?: "name_asc" | "name_desc" | "recent" | "oldest" | "most_orders" | "most_spent";
  page?: number;
  limit?: number;
};
