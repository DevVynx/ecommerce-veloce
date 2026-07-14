export type AdminCustomerDto = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
};

export type AdminListCustomersResponse = {
  customers: AdminCustomerDto[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
};
