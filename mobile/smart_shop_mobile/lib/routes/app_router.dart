import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/user_model.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/customers/customer_form_screen.dart';
import '../screens/customers/customers_screen.dart';
import '../screens/dashboard/accountant_dashboard.dart';
import '../screens/dashboard/admin_dashboard.dart';
import '../screens/dashboard/customer_dashboard.dart';
import '../screens/dashboard/dashboard_shell.dart';
import '../screens/dashboard/manager_dashboard.dart';
import '../screens/dashboard/salesman_dashboard.dart';
import '../screens/khata/khata_screen.dart';
import '../screens/payments/create_payment_screen.dart';
import '../screens/payments/payments_screen.dart';
import '../screens/products/product_form_screen.dart';
import '../screens/products/products_screen.dart';
import '../screens/purchases/create_purchase_screen.dart';
import '../screens/purchases/purchases_screen.dart';
import '../screens/reports/reports_screen.dart';
import '../screens/sales/create_sale_screen.dart';
import '../screens/sales/sale_detail_screen.dart';
import '../screens/sales/sales_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/suppliers/supplier_form_screen.dart';
import '../screens/suppliers/suppliers_screen.dart';
import '../screens/users/user_form_screen.dart';
import '../screens/users/users_screen.dart';

class AppRouter {
  AppRouter(this.auth);

  final AuthProvider auth;

  late final router = GoRouter(
    refreshListenable: auth,
    initialLocation: '/dashboard',
    redirect: (context, state) {
      final atLogin = state.matchedLocation == '/login';
      final atSplash = state.matchedLocation == '/splash';
      if (auth.loading) return atSplash ? null : '/splash';
      if (!auth.isAuthenticated) return atLogin ? null : '/login';
      if (atLogin || atSplash) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      ShellRoute(
        builder: (context, state, child) =>
            DashboardShell(location: state.uri.path, child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => _dashboardFor(auth.user?.role),
          ),
          GoRoute(
            path: '/products',
            builder: (context, state) => const ProductsScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const ProductFormScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    ProductFormScreen(id: state.pathParameters['id']),
              ),
            ],
          ),
          GoRoute(
            path: '/customers',
            builder: (context, state) => const CustomersScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const CustomerFormScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    CustomerFormScreen(id: state.pathParameters['id']),
              ),
            ],
          ),
          GoRoute(
            path: '/suppliers',
            builder: (context, state) => const SuppliersScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const SupplierFormScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    SupplierFormScreen(id: state.pathParameters['id']),
              ),
            ],
          ),
          GoRoute(
            path: '/users',
            builder: (context, state) => const UsersScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const UserFormScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    UserFormScreen(id: state.pathParameters['id']),
              ),
            ],
          ),
          GoRoute(
            path: '/sales',
            builder: (context, state) => const SalesScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const CreateSaleScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    SaleDetailScreen(id: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: '/purchases',
            builder: (context, state) => const PurchasesScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const CreatePurchaseScreen(),
              ),
            ],
          ),
          GoRoute(
            path: '/khata',
            builder: (context, state) => const KhataScreen(),
          ),
          GoRoute(
            path: '/payments',
            builder: (context, state) => const PaymentsScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const CreatePaymentScreen(),
              ),
            ],
          ),
          GoRoute(
            path: '/reports',
            builder: (context, state) => const ReportsScreen(),
          ),
        ],
      ),
    ],
  );

  static Widget _dashboardFor(Role? role) {
    return switch (role) {
      Role.manager => const ManagerDashboard(),
      Role.salesman => const SalesmanDashboard(),
      Role.accountant => const AccountantDashboard(),
      Role.customer => const CustomerDashboard(),
      _ => const AdminDashboard(),
    };
  }
}
