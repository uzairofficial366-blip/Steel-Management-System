import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Trash2 } from "lucide-react";
import { api, money } from "../../lib/api";
import { PageHeader } from "../../components/DashboardLayout";
import type { Customer, Product, User } from "../../lib/types";

type Field = { name: string; label: string; type?: string; options?: string[] };

function DataShell<T extends { id: string }>({
  title,
  subtitle,
  endpoint,
  rootKey,
  fields,
  columns,
  initial,
  canDelete = true,
  extraActions,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  rootKey: string;
  fields: Field[];
  columns: Array<[string, (row: T) => string]>;
  initial: Record<string, string | number | boolean>;
  canDelete?: boolean;
  extraActions?: (row: T, reload: () => void) => ReactNode;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [form, setForm] = useState(initial);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );

  function load() {
    api.get(endpoint).then((response) => setRows(response.data[rootKey] || []));
  }

  useEffect(load, [endpoint, rootKey]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post(endpoint, form);
    toast.success(`${title} saved`);
    setForm(initial);
    load();
  }

  async function remove(row: T) {
    if (!confirm("Delete this record?")) return;
    await api.delete(`${endpoint}/${row.id}`);
    toast.success("Deleted");
    load();
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <h3 className="font-bold">Add record</h3>
          {fields.map((field) => (
            <label key={field.name} className="block text-sm">
              {field.label}
              {field.options ? (
                <select className="input mt-2" value={String(form[field.name] ?? "")} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}>
                  <option value="">Select</option>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  className="input mt-2"
                  type={field.type || "text"}
                  value={String(form[field.name] ?? "")}
                  onChange={(event) => setForm({ ...form, [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value })}
                />
              )}
            </label>
          ))}
          <button className="btn-primary w-full"><Plus className="h-4 w-4" />Save</button>
        </form>
        <div className="card overflow-hidden">
          <div className="border-b border-borderColor p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-textMuted" />
              <input className="input pl-10" placeholder="Search and filter..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-secondary text-textMuted">
                <tr>
                  {columns.map(([label]) => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}
                  {(canDelete || extraActions) && <th className="px-4 py-3 font-semibold">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-borderColor">
                    {columns.map(([label, render]) => <td key={label} className="px-4 py-3">{render(row)}</td>)}
                    {(canDelete || extraActions) && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {extraActions?.(row, load)}
                          {canDelete && <button onClick={() => remove(row)} className="btn-muted text-danger"><Trash2 className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsPage() {
  return (
    <DataShell<Product>
      title="Products"
      subtitle="Manage stock, prices, and low stock limits."
      endpoint="/products"
      rootKey="products"
      initial={{ name: "", category: "", purchasePrice: 0, salePrice: 0, quantity: 0, lowStockLimit: 5 }}
      fields={[
        { name: "name", label: "Product name" },
        { name: "category", label: "Category" },
        { name: "purchasePrice", label: "Purchase price", type: "number" },
        { name: "salePrice", label: "Sale price", type: "number" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "lowStockLimit", label: "Low stock limit", type: "number" },
      ]}
      columns={[
        ["Name", (p) => p.name],
        ["Category", (p) => p.category],
        ["Sale price", (p) => `PKR ${money(p.salePrice)}`],
        ["Stock", (p) => String(p.quantity)],
        ["Alert at", (p) => String(p.lowStockLimit)],
      ]}
    />
  );
}

export function CustomersPage() {
  return (
    <DataShell<Customer>
      title="Customers"
      subtitle="Customer profiles for sales, khata, and account access."
      endpoint="/customers"
      rootKey="customers"
      initial={{ name: "", phone: "", address: "", openingBalance: 0 }}
      fields={[
        { name: "name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "address", label: "Address" },
        { name: "openingBalance", label: "Opening balance", type: "number" },
      ]}
      columns={[
        ["Name", (c) => c.name],
        ["Phone", (c) => c.phone],
        ["Address", (c) => c.address],
        ["Opening", (c) => `PKR ${money(c.openingBalance)}`],
      ]}
    />
  );
}

export function SuppliersPage() {
  return (
    <DataShell<{ id: string; name: string; phone: string; address: string }>
      title="Suppliers"
      subtitle="Supplier records and payment tracking."
      endpoint="/suppliers"
      rootKey="suppliers"
      initial={{ name: "", phone: "", address: "" }}
      fields={[{ name: "name", label: "Name" }, { name: "phone", label: "Phone" }, { name: "address", label: "Address" }]}
      columns={[["Name", (s) => s.name], ["Phone", (s) => s.phone], ["Address", (s) => s.address]]}
    />
  );
}

export function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => { api.get("/customers").then((response) => setCustomers(response.data.customers || [])); }, []);
  async function resetPassword(user: User) {
    const password = prompt(`New password for ${user.userId}`);
    if (!password) return;
    await api.put(`/users/${user.id}/password`, { password });
    toast.success("Password reset");
  }
  async function toggleActive(user: User, reload: () => void) {
    await api.put(`/users/${user.id}`, { isActive: !user.isActive });
    toast.success(user.isActive ? "User deactivated" : "User activated");
    reload();
  }
  return (
    <DataShell<User>
      title="User management"
      subtitle="Create role accounts, activate users, and link customer logins."
      endpoint="/users"
      rootKey="users"
      initial={{ userId: "", name: "", password: "", role: "SALESMAN", isActive: "true", customerId: "" }}
      fields={[
        { name: "userId", label: "User ID" },
        { name: "name", label: "Name" },
        { name: "password", label: "Password", type: "password" },
        { name: "role", label: "Role", options: ["ADMIN", "MANAGER", "SALESMAN", "ACCOUNTANT", "CUSTOMER"] },
        { name: "isActive", label: "Active", options: ["true", "false"] },
        { name: "customerId", label: `Customer profile (${customers.length} available)`, options: ["", ...customers.map((c) => c.id)] },
      ]}
      columns={[
        ["User ID", (u) => u.userId],
        ["Name", (u) => u.name],
        ["Role", (u) => u.role],
        ["Active", (u) => String(u.isActive)],
        ["Customer", (u) => u.customer?.name || "-"],
      ]}
      extraActions={(user, reload) => (
        <>
          <button type="button" onClick={() => resetPassword(user)} className="btn-muted">Reset</button>
          <button type="button" onClick={() => toggleActive(user, reload)} className="btn-muted">
            {user.isActive ? "Deactivate" : "Activate"}
          </button>
        </>
      )}
    />
  );
}
