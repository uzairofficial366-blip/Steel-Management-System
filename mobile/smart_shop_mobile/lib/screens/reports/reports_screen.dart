import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/widgets/empty_view.dart';
import '../../core/widgets/iron_card.dart';
import '../../core/widgets/loading_view.dart';
import '../../core/widgets/money_text.dart';
import '../../providers/report_provider.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => context.read<ReportProvider>().fetchReports(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ReportProvider>();
    final profit = provider.profitLoss;
    return Scaffold(
      appBar: AppBar(title: const Text('Reports')),
      body: provider.loading
          ? const LoadingView()
          : RefreshIndicator(
              onRefresh: provider.fetchReports,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (profit == null)
                    EmptyView(message: provider.error ?? 'Reports unavailable')
                  else ...[
                    SizedBox(
                      height: 220,
                      child: IronCard(
                        child: BarChart(
                          BarChartData(
                            borderData: FlBorderData(show: false),
                            titlesData: const FlTitlesData(
                              leftTitles: AxisTitles(
                                sideTitles: SideTitles(showTitles: false),
                              ),
                              topTitles: AxisTitles(
                                sideTitles: SideTitles(showTitles: false),
                              ),
                              rightTitles: AxisTitles(
                                sideTitles: SideTitles(showTitles: false),
                              ),
                            ),
                            barGroups: [
                              _bar(0, profit['revenue'], AppColors.success),
                              _bar(1, profit['cost'], AppColors.warning),
                              _bar(2, profit['expenses'], AppColors.danger),
                              _bar(3, profit['profit'], AppColors.primary),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    IronCard(
                      child: Column(
                        children: [
                          _row('Revenue', profit['revenue']),
                          _row('Cost', profit['cost']),
                          _row('Expenses', profit['expenses']),
                          _row('Profit', profit['profit']),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Customer dues',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    ...provider.customerDues
                        .take(20)
                        .map(
                          (item) => IronCard(
                            child: ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(
                                '${item['customer']?['name'] ?? 'Customer'}',
                              ),
                              trailing: Text(
                                money(
                                  double.tryParse('${item['due'] ?? 0}') ?? 0,
                                ),
                              ),
                            ),
                          ),
                        ),
                    const SizedBox(height: 16),
                    Text(
                      'Supplier dues',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    ...provider.supplierDues
                        .take(20)
                        .map(
                          (item) => IronCard(
                            child: ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(
                                '${item['supplier']?['name'] ?? 'Supplier'}',
                              ),
                              trailing: Text(
                                money(
                                  double.tryParse('${item['due'] ?? 0}') ?? 0,
                                ),
                              ),
                            ),
                          ),
                        ),
                  ],
                ],
              ),
            ),
    );
  }

  BarChartGroupData _bar(int x, dynamic value, Color color) =>
      BarChartGroupData(
        x: x,
        barRods: [
          BarChartRodData(
            toY: (double.tryParse('${value ?? 0}') ?? 0).abs(),
            color: color,
            width: 18,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      );
  Widget _row(String label, dynamic value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Text(
          money(double.tryParse('${value ?? 0}') ?? 0),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ],
    ),
  );
}
