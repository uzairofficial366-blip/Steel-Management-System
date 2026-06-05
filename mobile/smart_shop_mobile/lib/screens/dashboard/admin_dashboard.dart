import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/widgets/empty_view.dart';
import '../../core/widgets/iron_card.dart';
import '../../core/widgets/loading_view.dart';
import '../../core/widgets/money_text.dart';
import '../../providers/auth_provider.dart';
import '../../providers/report_provider.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key, this.title = 'Dashboard'});
  final String title;

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => context.read<ReportProvider>().fetchDashboard(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ReportProvider>();
    final report = provider.dashboard;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          IconButton(
            tooltip: 'Logout',
            icon: const Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: provider.fetchDashboard,
        child: provider.loading
            ? const LoadingView()
            : report == null
            ? EmptyView(
                message: provider.error ?? 'Dashboard report is unavailable',
              )
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  GridView.count(
                    crossAxisCount: MediaQuery.sizeOf(context).width > 560
                        ? 2
                        : 1,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 10,
                    childAspectRatio: 2.9,
                    children: [
                      _Metric(
                        'Total stock',
                        '${report.totalStock}',
                        Icons.inventory_2_outlined,
                      ),
                      _Metric(
                        'Today sales',
                        money(report.todaySales),
                        Icons.today_outlined,
                      ),
                      _Metric(
                        'Monthly sales',
                        money(report.monthlySales),
                        Icons.calendar_month_outlined,
                      ),
                      _Metric(
                        'Customers',
                        '${report.totalCustomers}',
                        Icons.people_alt_outlined,
                      ),
                      _Metric(
                        'Customer dues',
                        money(report.customerDues),
                        Icons.trending_down_outlined,
                      ),
                      _Metric(
                        'Supplier dues',
                        money(report.supplierDues),
                        Icons.local_shipping_outlined,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Low stock products',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...report.lowStock.map(
                    (item) => IronCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(item.name),
                        subtitle: Text(
                          '${item.category} - ${item.quantity} left',
                        ),
                        trailing: const Icon(
                          Icons.warning_amber,
                          color: AppColors.warning,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Recent invoices',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...report.recentInvoices.map(
                    (sale) => IronCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(sale.invoiceNumber),
                        subtitle: Text(sale.customer?.name ?? 'Customer'),
                        trailing: Text(money(sale.totalAmount)),
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric(this.label, this.value, this.icon);
  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return IronCard(
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.primary.withValues(alpha: .15),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(label, style: const TextStyle(color: AppColors.textMuted)),
                Text(
                  value,
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
