import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/widgets/empty_view.dart';
import '../../core/widgets/iron_card.dart';
import '../../core/widgets/loading_view.dart';
import '../../core/widgets/money_text.dart';
import '../../providers/auth_provider.dart';
import '../../providers/payment_provider.dart';
import '../../providers/report_provider.dart';
import '../../providers/sale_provider.dart';

class CustomerDashboard extends StatefulWidget {
  const CustomerDashboard({super.key});

  @override
  State<CustomerDashboard> createState() => _CustomerDashboardState();
}

class _CustomerDashboardState extends State<CustomerDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final customerId = context.read<AuthProvider>().user?.customerId;
    await Future.wait([
      context.read<SaleProvider>().fetch(),
      context.read<PaymentProvider>().fetch(),
      if (customerId != null)
        context.read<ReportProvider>().fetchKhata(customerId),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final sales = context.watch<SaleProvider>();
    final payments = context.watch<PaymentProvider>();
    final khata = context.watch<ReportProvider>();
    final loading = sales.loading || payments.loading || khata.loading;
    final dues = sales.items.fold<double>(
      0,
      (sum, sale) => sum + sale.remainingAmount,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Dashboard'),
        actions: [
          IconButton(
            tooltip: 'Logout',
            icon: const Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _load,
        child: loading
            ? const LoadingView()
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _Metric(
                    'Outstanding dues',
                    money(dues),
                    Icons.account_balance_wallet_outlined,
                  ),
                  _Metric(
                    'Khata balance',
                    money(khata.khataBalance),
                    Icons.request_quote_outlined,
                  ),
                  _Metric(
                    'Invoices',
                    '${sales.items.length}',
                    Icons.receipt_long_outlined,
                  ),
                  _Metric(
                    'Payments',
                    '${payments.items.length}',
                    Icons.payments_outlined,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Recent invoices',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (sales.items.isEmpty)
                    const SizedBox(
                      height: 180,
                      child: EmptyView(message: 'No invoices found'),
                    )
                  else
                    ...sales.items
                        .take(8)
                        .map(
                          (sale) => IronCard(
                            child: ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(sale.invoiceNumber),
                              subtitle: Text(sale.paymentStatus),
                              trailing: Text(money(sale.remainingAmount)),
                            ),
                          ),
                        ),
                  const SizedBox(height: 16),
                  Text(
                    'Recent payments',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (payments.items.isEmpty)
                    const SizedBox(
                      height: 120,
                      child: EmptyView(message: 'No payments found'),
                    )
                  else
                    ...payments.items
                        .take(6)
                        .map(
                          (payment) => IronCard(
                            child: ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(payment.type.replaceAll('_', ' ')),
                              subtitle: Text(payment.note ?? ''),
                              trailing: Text(money(payment.amount)),
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: IronCard(
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
                children: [
                  Text(
                    label,
                    style: const TextStyle(color: AppColors.textMuted),
                  ),
                  Text(
                    value,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
