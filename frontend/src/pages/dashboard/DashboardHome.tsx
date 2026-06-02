import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, Boxes, CreditCard, FileText, Users, WalletCards } from "lucide-react";
import { api, money } from "../../lib/api";
import type { DashboardReport } from "../../lib/types";
import { PageHeader, StatCard } from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const roleCopy = {
  ADMIN: "Total stock, sales, dues, low stock alerts, users, and reports.",
  MANAGER: "Stock, sales, customer records, low stock alerts, and reports.",
  SALESMAN: "Create sales, invoices, assigned customers, stock checks, and daily history.",
  ACCOUNTANT: "Khata, payments, expenses, profit/loss, and daily cash summary.",
  CUSTOMER: "Your invoices, khata balance, payment history, and shop contact.",
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [customerData, setCustomerData] = useState<{ invoices: number; payments: number; balance: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role === "CUSTOMER") {
      Promise.all([
        api.get("/sales"),
        api.get("/payments"),
        user.customerId ? api.get(`/khata/customer/${user.customerId}`) : Promise.resolve({ data: { balance: 0 } }),
      ]).then(([sales, payments, khata]) => {
        setCustomerData({ invoices: sales.data.sales.length, payments: payments.data.payments.length, balance: khata.data.balance });
      });
      return;
    }
    api.get("/reports/dashboard").then((response) => setReport(response.data));
  }, [user]);

  if (!user) return null;

  if (user.role === "CUSTOMER") {
    return (
      <div>
        <PageHeader title="Customer Dashboard" subtitle={roleCopy.CUSTOMER} />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="My invoices" value={String(customerData?.invoices || 0)} icon={FileText} />
          <StatCard label="Khata balance" value={`PKR ${money(customerData?.balance || 0)}`} icon={WalletCards} />
          <StatCard label="Payments" value={String(customerData?.payments || 0)} icon={CreditCard} />
        </div>
        <div className="card mt-6 p-6">
          <h3 className="text-lg font-bold">Contact shop/admin</h3>
          <p className="mt-2 text-textMuted">For invoice or balance questions, contact the shop administrator.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    ["Total stock", money(report?.totalStock), Boxes],
    ["Today sales", `PKR ${money(report?.todaySales)}`, BarChart3],
    ["Monthly sales", `PKR ${money(report?.monthlySales)}`, BarChart3],
    ["Total customers", money(report?.totalCustomers), Users],
    ["Customer dues", `PKR ${money(report?.customerDues)}`, WalletCards],
    ["Supplier dues", `PKR ${money(report?.supplierDues)}`, CreditCard],
    ["Low stock alerts", money(report?.lowStock?.length), AlertTriangle],
  ] as const;

  return (
    <div>
      <PageHeader title={`${user.role[0]}${user.role.slice(1).toLowerCase()} Dashboard`} subtitle={roleCopy[user.role]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value, icon]) => (
          <StatCard key={label} label={label} value={value} icon={icon} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-bold">Low stock alerts</h3>
          <div className="space-y-3">
            {(report?.lowStock || []).map((product) => (
              <div key={product.id} className="flex justify-between rounded-md bg-secondary p-3 text-sm">
                <span>{product.name}</span>
                <span className="text-warning">{product.quantity} left</span>
              </div>
            ))}
            {!report?.lowStock?.length && <p className="text-sm text-textMuted">No low stock items.</p>}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-bold">Recent invoices</h3>
          <div className="space-y-3">
            {(report?.recentInvoices || []).map((sale) => (
              <div key={sale.id} className="flex justify-between rounded-md bg-secondary p-3 text-sm">
                <span>{sale.invoiceNumber}</span>
                <span>PKR {money(sale.totalAmount)}</span>
              </div>
            ))}
            {!report?.recentInvoices?.length && <p className="text-sm text-textMuted">No invoices yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
