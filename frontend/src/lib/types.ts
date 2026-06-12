export type Role = "ADMIN" | "MANAGER" | "SALESMAN" | "ACCOUNTANT" | "CUSTOMER";

export type User = {
  id: string;
  userId: string;
  name: string;
  role: Role;
  isActive: boolean;
  customerId?: string | null;
  customer?: Customer | null;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  openingBalance: string | number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  purchasePrice: string | number;
  salePrice: string | number;
  quantity: number;
  lowStockLimit: number;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export type Sale = {
  id: string;
  invoiceNumber: string;
  totalAmount: string | number;
  paidAmount: string | number;
  remainingAmount: string | number;
  paymentStatus: string;
  createdAt: string;
  customer?: Customer;
  items?: Array<{ id: string; quantity: number; price: string | number; subtotal: string | number; product?: Product }>;
};

export type Purchase = {
  id: string;
  invoiceNumber: string;
  totalAmount: string | number;
  paidAmount: string | number;
  remainingAmount: string | number;
  paymentStatus: string;
  createdAt: string;
  supplier?: Supplier;
  items?: Array<{ id: string; quantity: number; price: string | number; subtotal: string | number; product?: Product }>;
};

export type DashboardReport = {
  totalStock: number;
  todaySales: number;
  monthlySales: number;
  totalCustomers: number;
  customerDues: number;
  supplierDues: number;
  lowStock: Product[];
  recentInvoices: Sale[];
};
