import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { api, money } from "../../lib/api";
import { PageHeader } from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import type { Customer, Supplier } from "../../lib/types";

export function KhataPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [form, setForm] = useState({ type: "DEBIT", amount: 0, description: "" });

  useEffect(() => {
    if (user?.role === "CUSTOMER" && user.customerId) {
      setCustomerId(user.customerId);
      return;
    }
    api.get("/customers").then((response) => {
      setCustomers(response.data.customers || []);
      setCustomerId(response.data.customers?.[0]?.id || "");
    });
  }, [user]);

  useEffect(() => {
    if (!customerId) return;
    api.get(`/khata/customer/${customerId}`).then((response) => {
      setEntries(response.data.entries || []);
      setBalance(response.data.balance || 0);
    });
  }, [customerId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/khata", { customerId, ...form });
    toast.success("Khata entry added");
    setForm({ type: "DEBIT", amount: 0, description: "" });
    const response = await api.get(`/khata/customer/${customerId}`);
    setEntries(response.data.entries || []);
    setBalance(response.data.balance || 0);
  }

  return (
    <div>
      <PageHeader title="Customer khata" subtitle="Track debit, credit, and customer balance." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {user?.role !== "CUSTOMER" && (
          <form onSubmit={submit} className="card h-fit space-y-4 p-5">
            <label className="block text-sm">
              Customer
              <select className="input mt-2" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              Type
              <select className="input mt-2" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="DEBIT">DEBIT</option>
                <option value="CREDIT">CREDIT</option>
              </select>
            </label>
            <label className="block text-sm">
              Amount
              <input className="input mt-2" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} />
            </label>
            <label className="block text-sm">
              Description
              <input className="input mt-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <button className="btn-primary w-full"><Plus className="h-4 w-4" />Add entry</button>
          </form>
        )}
        <div className={`card overflow-hidden ${user?.role === "CUSTOMER" ? "xl:col-span-2" : ""}`}>
          <div className="border-b border-borderColor p-5">
            <p className="text-sm text-textMuted">Current balance</p>
            <p className="mt-1 text-2xl font-bold">PKR {money(balance)}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-secondary text-textMuted"><tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Date</th></tr></thead>
              <tbody>{entries.map((entry) => <tr key={entry.id} className="border-t border-borderColor"><td className="px-4 py-3">{entry.type}</td><td className="px-4 py-3">PKR {money(entry.amount)}</td><td className="px-4 py-3">{entry.description}</td><td className="px-4 py-3">{new Date(entry.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentsPage({ expenseOnly = false }: { expenseOnly?: boolean }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ customerId: "", supplierId: "", amount: 0, type: expenseOnly ? "EXPENSE" : "CUSTOMER_PAYMENT", note: "" });

  function load() {
    api.get("/payments").then((response) => setPayments(response.data.payments || []));
  }

  useEffect(() => {
    load();
    if (user?.role !== "CUSTOMER") {
      api.get("/customers").then((response) => setCustomers(response.data.customers || [])).catch(() => null);
      api.get("/suppliers").then((response) => setSuppliers(response.data.suppliers || [])).catch(() => null);
    }
  }, [user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.type === "CUSTOMER_PAYMENT" && !form.customerId) return toast.error("Choose a customer");
    if (form.type === "SUPPLIER_PAYMENT" && !form.supplierId) return toast.error("Choose a supplier");
    await api.post("/payments", form);
    toast.success(expenseOnly ? "Expense saved" : "Payment saved");
    setForm({ customerId: "", supplierId: "", amount: 0, type: expenseOnly ? "EXPENSE" : "CUSTOMER_PAYMENT", note: "" });
    load();
  }

  return (
    <div>
      <PageHeader title={expenseOnly ? "Expenses" : "Payments"} subtitle="Record customer payments, supplier payments, and expenses." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {user?.role !== "CUSTOMER" && (
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          {!expenseOnly && form.type === "CUSTOMER_PAYMENT" && (
            <label className="block text-sm">Customer
              <select className="input mt-2" value={form.customerId} onChange={(event) => setForm({ ...form, customerId: event.target.value })}>
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </label>
          )}
          {!expenseOnly && form.type === "SUPPLIER_PAYMENT" && (
            <label className="block text-sm">Supplier
              <select className="input mt-2" value={form.supplierId} onChange={(event) => setForm({ ...form, supplierId: event.target.value })}>
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
            </label>
          )}
          <label className="block text-sm">Type
            <select
              className="input mt-2"
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value, customerId: "", supplierId: "" })}
              disabled={expenseOnly}
            >
              <option value="CUSTOMER_PAYMENT">CUSTOMER_PAYMENT</option>
              <option value="SUPPLIER_PAYMENT">SUPPLIER_PAYMENT</option>
              <option value="EXPENSE">EXPENSE</option>
              <option value="SALE_RECEIPT">SALE_RECEIPT</option>
            </select>
          </label>
          <label className="block text-sm">Amount
            <input className="input mt-2" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} />
          </label>
          <label className="block text-sm">Note
            <input className="input mt-2" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
          </label>
          <button className="btn-primary w-full"><Plus className="h-4 w-4" />Save</button>
        </form>
        )}
        <div className={`card overflow-x-auto ${user?.role === "CUSTOMER" ? "xl:col-span-2" : ""}`}>
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-secondary text-textMuted"><tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Note</th><th className="px-4 py-3">Date</th></tr></thead>
            <tbody>{payments.filter((p) => !expenseOnly || p.type === "EXPENSE").map((p) => <tr key={p.id} className="border-t border-borderColor"><td className="px-4 py-3">{p.type}</td><td className="px-4 py-3">PKR {money(p.amount)}</td><td className="px-4 py-3">{p.customer?.name || "-"}</td><td className="px-4 py-3">{p.supplier?.name || "-"}</td><td className="px-4 py-3">{p.note}</td><td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
