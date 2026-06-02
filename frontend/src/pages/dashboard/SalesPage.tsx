import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle, Plus, Search } from "lucide-react";
import { api, money } from "../../lib/api";
import { PageHeader } from "../../components/DashboardLayout";
import type { Customer, Product, Sale } from "../../lib/types";

export function SalesPage({ createMode = false }: { createMode?: boolean }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paidAmount, setPaidAmount] = useState(0);

  const selectedProduct = products.find((product) => product.id === productId);
  const filtered = useMemo(
    () => sales.filter((sale) => JSON.stringify(sale).toLowerCase().includes(search.toLowerCase())),
    [sales, search],
  );

  function load() {
    api.get("/sales").then((response) => setSales(response.data.sales || []));
  }

  useEffect(() => {
    load();
    api.get("/customers").then((response) => setCustomers(response.data.customers || [])).catch(() => null);
    api.get("/products").then((response) => setProducts(response.data.products || [])).catch(() => null);
  }, []);

  async function createSale(event: FormEvent) {
    event.preventDefault();
    if (!customerId || !productId) return toast.error("Choose customer and product");
    await api.post("/sales", { customerId, paidAmount, items: [{ productId, quantity }] });
    toast.success("Invoice created");
    setProductId("");
    setQuantity(1);
    setPaidAmount(0);
    load();
  }

  function shareInvoice(sale: Sale) {
    const text = `Smart Shop Invoice ${sale.invoiceNumber}%0ATotal: PKR ${money(sale.totalAmount)}%0APaid: PKR ${money(sale.paidAmount)}%0ARemaining: PKR ${money(sale.remainingAmount)}`;
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div>
      <PageHeader title={createMode ? "Create sale" : "Sales and invoices"} subtitle="Create invoices, review sales, and share invoices on WhatsApp." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {createMode && (
          <form onSubmit={createSale} className="card h-fit space-y-4 p-5">
            <h3 className="font-bold">New invoice</h3>
            <label className="block text-sm">
              Customer
              <select className="input mt-2" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              Product
              <select className="input mt-2" value={productId} onChange={(event) => setProductId(event.target.value)}>
                <option value="">Select product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.quantity})</option>)}
              </select>
            </label>
            <label className="block text-sm">
              Quantity
              <input className="input mt-2" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
            </label>
            <label className="block text-sm">
              Paid amount
              <input className="input mt-2" type="number" value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value))} />
            </label>
            <div className="rounded-md bg-secondary p-3 text-sm text-textMuted">
              Total estimate: PKR {money(Number(selectedProduct?.salePrice || 0) * quantity)}
            </div>
            <button className="btn-primary w-full"><Plus className="h-4 w-4" />Create invoice</button>
          </form>
        )}
        <div className={`card overflow-hidden ${createMode ? "" : "xl:col-span-2"}`}>
          <div className="border-b border-borderColor p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-textMuted" />
              <input className="input pl-10" placeholder="Search invoices..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-secondary text-textMuted">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Share</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sale) => (
                  <tr key={sale.id} className="border-t border-borderColor">
                    <td className="px-4 py-3">{sale.invoiceNumber}</td>
                    <td className="px-4 py-3">{sale.customer?.name || "-"}</td>
                    <td className="px-4 py-3">PKR {money(sale.totalAmount)}</td>
                    <td className="px-4 py-3">PKR {money(sale.paidAmount)}</td>
                    <td className="px-4 py-3">PKR {money(sale.remainingAmount)}</td>
                    <td className="px-4 py-3">{sale.paymentStatus}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => shareInvoice(sale)} className="btn-muted"><MessageCircle className="h-4 w-4" /></button>
                    </td>
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
