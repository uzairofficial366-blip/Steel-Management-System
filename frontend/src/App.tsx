import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import { CustomersPage, ProductsPage, SuppliersPage, UsersPage } from "./pages/dashboard/CrudPages";
import { SalesPage } from "./pages/dashboard/SalesPage";
import { KhataPage, PaymentsPage } from "./pages/dashboard/FinancePages";
import { ReportsPage, SettingsPage } from "./pages/dashboard/ReportsPage";
import { PurchasesPage } from "./pages/dashboard/PurchasesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="sales" element={<SalesPage createMode />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="khata" element={<KhataPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["MANAGER"]} />}>
        <Route path="/manager" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="sales" element={<SalesPage createMode />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["SALESMAN"]} />}>
        <Route path="/salesman" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/salesman/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="create-sale" element={<SalesPage createMode />} />
          <Route path="invoices" element={<SalesPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["ACCOUNTANT"]} />}>
        <Route path="/accountant" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/accountant/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="khata" element={<KhataPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="expenses" element={<PaymentsPage expenseOnly />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
        <Route path="/customer" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="invoices" element={<SalesPage />} />
          <Route path="khata" element={<KhataPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
