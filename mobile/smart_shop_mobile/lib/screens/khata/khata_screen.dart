import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/widgets/empty_view.dart';
import '../../core/widgets/iron_card.dart';
import '../../core/widgets/money_text.dart';
import '../../models/customer_model.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/customer_provider.dart';
import '../../providers/report_provider.dart';

class KhataScreen extends StatefulWidget {
  const KhataScreen({super.key});

  @override
  State<KhataScreen> createState() => _KhataScreenState();
}

class _KhataScreenState extends State<KhataScreen> {
  Customer? customer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final auth = context.read<AuthProvider>().user;
      if (auth?.role == Role.customer && auth?.customerId != null) {
        context.read<ReportProvider>().fetchKhata(auth!.customerId!);
      } else {
        await context.read<CustomerProvider>().fetch();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>().user;
    final customers = context.watch<CustomerProvider>().items;
    final reports = context.watch<ReportProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Khata')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (auth?.role != Role.customer)
            DropdownButtonFormField<Customer>(
              initialValue: customer,
              decoration: const InputDecoration(labelText: 'Customer'),
              items: customers
                  .map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
                  .toList(),
              onChanged: (value) {
                setState(() => customer = value);
                if (value != null) {
                  context.read<ReportProvider>().fetchKhata(value.id);
                }
              },
            ),
          const SizedBox(height: 14),
          IronCard(
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Balance'),
              trailing: Text(
                money(reports.khataBalance),
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          if (reports.khataEntries.isEmpty)
            const SizedBox(
              height: 240,
              child: EmptyView(message: 'Select a customer to view khata'),
            )
          else
            ...reports.khataEntries.map(
              (entry) => IronCard(
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(entry.description),
                  subtitle: Text(entry.type),
                  trailing: Text(money(entry.amount)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
