import { ReactNode, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../lib/types";

type NavItem = { label: string; path: string; icon: typeof Home };

const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: Home },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Products", path: "/admin/products", icon: Boxes },
    { label: "Customers", path: "/admin/customers", icon: Users },
    { label: "Sales", path: "/admin/sales", icon: ShoppingCart },
    { label: "Khata", path: "/admin/khata", icon: WalletCards },
    { label: "Suppliers", path: "/admin/suppliers", icon: Receipt },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/manager/dashboard", icon: Home },
    { label: "Products", path: "/manager/products", icon: Boxes },
    { label: "Sales", path: "/manager/sales", icon: ShoppingCart },
    { label: "Customers", path: "/manager/customers", icon: Users },
    { label: "Reports", path: "/manager/reports", icon: BarChart3 },
  ],
  SALESMAN: [
    { label: "Dashboard", path: "/salesman/dashboard", icon: Home },
    { label: "Create Sale", path: "/salesman/create-sale", icon: ShoppingCart },
    { label: "Invoices", path: "/salesman/invoices", icon: FileText },
    { label: "Customers", path: "/salesman/customers", icon: Users },
  ],
  ACCOUNTANT: [
    { label: "Dashboard", path: "/accountant/dashboard", icon: Home },
    { label: "Khata", path: "/accountant/khata", icon: WalletCards },
    { label: "Payments", path: "/accountant/payments", icon: CreditCard },
    { label: "Expenses", path: "/accountant/expenses", icon: Receipt },
    { label: "Reports", path: "/accountant/reports", icon: BarChart3 },
  ],
  CUSTOMER: [
    { label: "Dashboard", path: "/customer/dashboard", icon: Home },
    { label: "Invoices", path: "/customer/invoices", icon: FileText },
    { label: "Khata", path: "/customer/khata", icon: WalletCards },
    { label: "Payments", path: "/customer/payments", icon: CreditCard },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navItems = user ? navByRole[user.role] : [];

  function signOut() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-borderColor bg-card">
      <div className="flex items-center justify-between border-b border-borderColor px-5 py-4">
        <Link to="/" className="text-xl font-extrabold">
          Smart <span className="text-accent">Shop</span>
        </Link>
        <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="border-b border-borderColor px-5 py-4">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs uppercase tracking-wide text-accent">{user?.role}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                isActive ? "bg-accent text-white" : "text-textMuted hover:bg-secondary hover:text-textPrimary"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={signOut} className="m-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-textMuted hover:bg-secondary hover:text-textPrimary">
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-primary text-textPrimary">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}
      {open && <div className="fixed inset-y-0 left-0 z-50 md:hidden">{sidebar}</div>}
      <div className="md:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-borderColor bg-primary/95 px-4 py-4 backdrop-blur md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div>
            <p className="text-sm text-textMuted">Smart Shop</p>
            <h1 className="text-lg font-bold sm:text-2xl">Management Dashboard</h1>
          </div>
          <button onClick={signOut} className="btn-muted hidden sm:inline-flex">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-textMuted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Home }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-textMuted">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-md bg-accent/15 p-3 text-accent">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
