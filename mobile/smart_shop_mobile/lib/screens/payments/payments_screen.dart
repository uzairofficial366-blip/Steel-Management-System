import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../core/widgets/money_text.dart';
import '../../models/payment_model.dart';
import '../../providers/payment_provider.dart';

class PaymentsScreen extends StatelessWidget {
  const PaymentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Payment, PaymentProvider>(
      title: 'Payments',
      searchHint: 'Search payments',
      addRoute: '/payments/new',
      canEdit: false,
      canDelete: false,
      matches: (item, query) =>
          item.type.toLowerCase().contains(query) ||
          (item.customer?.name.toLowerCase().contains(query) ?? false) ||
          (item.supplier?.name.toLowerCase().contains(query) ?? false),
      titleOf: (item) => item.type.replaceAll('_', ' '),
      subtitleOf: (item) =>
          item.customer?.name ?? item.supplier?.name ?? item.note ?? 'Expense',
      trailing: (item) => Text(money(item.amount)),
    );
  }
}
