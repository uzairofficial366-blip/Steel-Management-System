import { useEffect, useState } from "react";
import { BarChart3, CreditCard, TrendingUp, WalletCards } from "lucide-react";
import { api, money } from "../../lib/api";
import { PageHeader, StatCard } from "../../components/DashboardLayout";

export function ReportsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [profit, setProfit] = useState<any>(null);
  const [customerDues, setCustomerDues] = useState<any[]>([]);
  const [supplierDues, setSupplierDues] = useState<any[]>([]);

  useEffect(() => {
    api.get("/reports/dashboard").then((response) => setDashboard(response.data));
    api.get("/reports/profit-loss").then((response) => setProfit(response.data));
    api.get("/reports/customer-dues").then((response) => setCustomerDues(response.data.dues || []));
    api.get("/reports/supplier-dues").then((response) => setSupplierDues(response.data.dues || []));
  }, []);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Sales, profit/loss, customer dues, and supplier dues." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Monthly sales" value={`PKR ${money(dashboard?.monthlySales)}`} icon={BarChart3} />
        <StatCard label="Profit" value={`PKR ${money(profit?.profit)}`} icon={TrendingUp} />
        <StatCard label="Customer dues" value={`PKR ${money(dashboard?.customerDues)}`} icon={WalletCards} />
        <StatCard label="Supplier dues" value={`PKR ${money(dashboard?.supplierDues)}`} icon={CreditCard} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-borderColor p-4 font-bold">Customer dues</div>
          <table className="w-full text-left text-sm">
            <tbody>{customerDues.map((row) => <tr key={row.customer.id} className="border-t border-borderColor"><td className="px-4 py-3">{row.customer.name}</td><td className="px-4 py-3 text-right">PKR {money(row.due)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="card overflow-hidden">
          <div className="border-b border-borderColor p-4 font-bold">Supplier dues</div>
          <table className="w-full text-left text-sm">
            <tbody>{supplierDues.map((row) => <tr key={row.supplier.id} className="border-t border-borderColor"><td className="px-4 py-3">{row.supplier.name}</td><td className="px-4 py-3 text-right">PKR {money(row.due)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="System settings are restricted to admin users." />
      <div className="card p-6">
        <h3 className="text-lg font-bold">Shop configuration</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">Shop name<input className="input mt-2" defaultValue="Smart Shop" /></label>
          <label className="block text-sm">Invoice prefix<input className="input mt-2" defaultValue="INV" /></label>
          <label className="block text-sm">Currency<input className="input mt-2" defaultValue="PKR" /></label>
          <label className="block text-sm">Low stock notification<input className="input mt-2" defaultValue="Enabled" /></label>
        </div>
        <button className="btn-primary mt-5" type="button">Save settings</button>
      </div>
    </div>
  );
}
