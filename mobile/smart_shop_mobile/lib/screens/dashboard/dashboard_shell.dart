import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';

class ModuleDestination {
  const ModuleDestination(this.label, this.path, this.icon, this.roles);
  final String label;
  final String path;
  final IconData icon;
  final Set<Role> roles;
}

const destinations = [
  ModuleDestination('Dashboard', '/dashboard', Icons.dashboard_outlined, {
    Role.admin,
    Role.manager,
    Role.salesman,
    Role.accountant,
    Role.customer,
  }),
  ModuleDestination('Users', '/users', Icons.group_outlined, {Role.admin}),
  ModuleDestination('Products', '/products', Icons.inventory_2_outlined, {
    Role.admin,
    Role.manager,
  }),
  ModuleDestination('Customers', '/customers', Icons.people_alt_outlined, {
    Role.admin,
    Role.manager,
    Role.salesman,
  }),
  ModuleDestination('Sales', '/sales', Icons.receipt_long_outlined, {
    Role.admin,
    Role.manager,
    Role.salesman,
    Role.customer,
  }),
  ModuleDestination('Purchases', '/purchases', Icons.shopping_bag_outlined, {
    Role.admin,
    Role.manager,
    Role.accountant,
  }),
  ModuleDestination('Khata', '/khata', Icons.account_balance_wallet_outlined, {
    Role.admin,
    Role.accountant,
    Role.customer,
  }),
  ModuleDestination('Payments', '/payments', Icons.payments_outlined, {
    Role.admin,
    Role.accountant,
    Role.customer,
  }),
  ModuleDestination('Suppliers', '/suppliers', Icons.local_shipping_outlined, {
    Role.admin,
    Role.accountant,
  }),
  ModuleDestination('Reports', '/reports', Icons.bar_chart_outlined, {
    Role.admin,
    Role.manager,
    Role.accountant,
  }),
];

class DashboardShell extends StatelessWidget {
  const DashboardShell({
    super.key,
    required this.child,
    required this.location,
  });

  final Widget child;
  final String location;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final role = auth.user?.role ?? Role.salesman;
    final allowed = destinations
        .where((item) => item.roles.contains(role))
        .toList();
    final selected = allowed.indexWhere(
      (item) => location == item.path || location.startsWith('${item.path}/'),
    );
    final bottom = allowed.take(5).toList();
    final bottomIndex = selected >= 0 && selected < bottom.length
        ? selected
        : 0;
    return Scaffold(
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            children: [
              ListTile(
                title: Text(
                  auth.user?.name ?? 'Smart Shop',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
                subtitle: Text(auth.user?.role.title ?? ''),
                leading: const CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: Icon(Icons.storefront, color: Colors.white),
                ),
              ),
              const Divider(),
              Expanded(
                child: ListView(
                  children: allowed
                      .map(
                        (item) => ListTile(
                          leading: Icon(item.icon),
                          title: Text(item.label),
                          selected: location.startsWith(item.path),
                          onTap: () => context.go(item.path),
                        ),
                      )
                      .toList(),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Logout'),
                onTap: () => context.read<AuthProvider>().logout(),
              ),
            ],
          ),
        ),
      ),
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: bottomIndex,
        onTap: (index) => context.go(bottom[index].path),
        items: bottom
            .map(
              (item) => BottomNavigationBarItem(
                icon: Icon(item.icon),
                label: item.label,
              ),
            )
            .toList(),
      ),
    );
  }
}
