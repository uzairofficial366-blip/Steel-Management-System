import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/DashboardLayout";
import { api, money } from "../../lib/api";
import type { Product, Purchase, Supplier } from "../../lib/types";

type PurchaseLine = { productId: string; quantity: number; purchasePrice: number };

const emptyLine: PurchaseLine = { productId: "", quantity: 1, purchasePrice: 0 };

export function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [items, setItems] = useState<PurchaseLine[]>([{ ...emptyLine }]);
  const [search, setSearch] = useState("");

  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.purchasePrice || 0), 0);
  const filtered = useMemo(
    () => purchases.filter((purchase) => JSON.stringify(purchase).toLowerCase().includes(search.toLowerCase())),
    [purchases, search],
  );

  function load() {
    api.get("/purchases").then((response) => setPurchases(response.data.purchases || []));
  }

  useEffect(() => {
    load();
    api.get("/suppliers").then((response) => setSuppliers(response.data.suppliers || [])).catch(() => null);
    api.get("/products").then((response) => setProducts(response.data.products || [])).catch(() => null);
  }, []);

  function updateLine(index: number, patch: Partial<PurchaseLine>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validItems = items.filter((item) => item.productId && item.quantity > 0 && item.purchasePrice > 0);
    if (!supplierId || !validItems.length) return toast.error("Choose supplier and at least one product");
    await api.post("/purchases", { supplierId, paidAmount, items: validItems });
    toast.success("Purchase saved");
    setSupplierId("");
    setPaidAmount(0);
    setItems([{ ...emptyLine }]);
    load();
  }

  return (
    <div>
      <PageHeader title="Purchases" subtitle="Record supplier purchases, update stock, and track remaining supplier dues." />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <label className="block text-sm">
            Supplier
            <select className="input mt-2" value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
            </select>
          </label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-md border border-borderColor p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_80px_110px_auto]">
                  <select className="input" value={item.productId} onChange={(event) => updateLine(index, { productId: event.target.value })}>
                    <option value="">Product</option>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                  <input className="input" type="number" min={1} value={item.quantity} onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })} />
                  <input className="input" type="number" min={0} value={item.purchasePrice} onChange={(event) => updateLine(index, { purchasePrice: Number(event.target.value) })} />
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
            <input className="input mt-2" type="number" min={0} value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value))} />
          </label>
          <div className="rounded-md bg-secondary p-3 text-sm text-textMuted">Total: PKR {money(total)} | Remaining: PKR {money(total - paidAmount)}</div>
          <button className="btn-primary w-full"><Plus className="h-4 w-4" />Save purchase</button>
        </form>
        <div className="card overflow-hidden">
          <div className="border-b border-borderColor p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-textMuted" />
              <input className="input pl-10" placeholder="Search purchases..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-secondary text-textMuted"><tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Remaining</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody>{filtered.map((purchase) => <tr key={purchase.id} className="border-t border-borderColor"><td className="px-4 py-3">{purchase.invoiceNumber}</td><td className="px-4 py-3">{purchase.supplier?.name || "-"}</td><td className="px-4 py-3">{purchase.items?.length || 0}</td><td className="px-4 py-3">PKR {money(purchase.totalAmount)}</td><td className="px-4 py-3">PKR {money(purchase.remainingAmount)}</td><td className="px-4 py-3">{purchase.paymentStatus}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
