import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle, Plus, Printer, Search, Trash2 } from "lucide-react";
import { api, money } from "../../lib/api";
import { PageHeader } from "../../components/DashboardLayout";
import type { Customer, Product, Sale } from "../../lib/types";

type SaleLine = { productId: string; quantity: number };
const emptyLine: SaleLine = { productId: "", quantity: 1 };

export function SalesPage({ createMode = false }: { createMode?: boolean }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<SaleLine[]>([{ ...emptyLine }]);
  const [paidAmount, setPaidAmount] = useState(0);

  const total = items.reduce((sum, item) => {
    const product = products.find((row) => row.id === item.productId);
    return sum + Number(product?.salePrice || 0) * Number(item.quantity || 0);
  }, 0);
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
    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    if (!customerId || !validItems.length) return toast.error("Choose customer and at least one product");
    await api.post("/sales", { customerId, paidAmount, items: validItems });
    toast.success("Invoice created");
    setItems([{ ...emptyLine }]);
    setPaidAmount(0);
    load();
  }

  function shareInvoice(sale: Sale) {
    const text = `Smart Shop Invoice ${sale.invoiceNumber}%0ATotal: PKR ${money(sale.totalAmount)}%0APaid: PKR ${money(sale.paidAmount)}%0ARemaining: PKR ${money(sale.remainingAmount)}`;
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function updateLine(index: number, patch: Partial<SaleLine>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function printInvoice(sale: Sale) {
    const rows = (sale.items || [])
      .map(
        (item) =>
          `<tr><td>${item.product?.name || "-"}</td><td>${item.quantity}</td><td>PKR ${money(item.price)}</td><td>PKR ${money(item.subtotal)}</td></tr>`,
      )
      .join("");
    const receipt = window.open("", "_blank", "width=420,height=720");
    if (!receipt) return toast.error("Popup blocked. Allow popups to print invoices.");
    receipt.document.write(`
      <html>
        <head>
          <title>${sale.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; margin: 24px; }
            h1 { font-size: 22px; margin: 0; }
            .muted { color: #555; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
            th, td { border-bottom: 1px solid #ddd; padding: 8px 4px; text-align: left; }
            .totals { margin-top: 18px; margin-left: auto; width: 220px; font-size: 13px; }
            .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>Smart Shop</h1>
          <p class="muted">Invoice ${sale.invoiceNumber}</p>
          <p><strong>Customer:</strong> ${sale.customer?.name || "-"}<br/><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>
          <table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
          <div class="totals">
            <div><span>Total</span><strong>PKR ${money(sale.totalAmount)}</strong></div>
            <div><span>Paid</span><strong>PKR ${money(sale.paidAmount)}</strong></div>
            <div><span>Remaining</span><strong>PKR ${money(sale.remainingAmount)}</strong></div>
          </div>
          <button onclick="window.print()">Print</button>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    receipt.document.close();
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
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="rounded-md border border-borderColor p-3">
                  <div className="grid gap-2 sm:grid-cols-[1fr_80px_auto]">
                    <select className="input" value={item.productId} onChange={(event) => updateLine(index, { productId: event.target.value })}>
                      <option value="">Select product</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.quantity})</option>)}
                    </select>
                    <input className="input" type="number" min={1} value={item.quantity} onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })} />
                    <button type="button" className="btn-muted px-3" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={items.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn-muted w-full" onClick={() => setItems((current) => [...current, { ...emptyLine }])}>
              <Plus className="h-4 w-4" />Add product
            </button>
            <label className="block text-sm">
              Paid amount
              <input className="input mt-2" type="number" value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value))} />
            </label>
            <div className="rounded-md bg-secondary p-3 text-sm text-textMuted">
              Total estimate: PKR {money(total)} | Remaining: PKR {money(total - paidAmount)}
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
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Actions</th>
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
                    <td className="px-4 py-3">{sale.items?.length || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => printInvoice(sale)} className="btn-muted"><Printer className="h-4 w-4" /></button>
                        <button onClick={() => shareInvoice(sale)} className="btn-muted"><MessageCircle className="h-4 w-4" /></button>
                      </div>
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
