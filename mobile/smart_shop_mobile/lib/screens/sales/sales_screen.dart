import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../core/widgets/money_text.dart';
import '../../models/sale_model.dart';
import '../../providers/sale_provider.dart';

class SalesScreen extends StatelessWidget {
  const SalesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Sale, SaleProvider>(
      title: 'Invoices',
      searchHint: 'Search invoices',
      addRoute: '/sales/new',
      canEdit: false,
      canDelete: false,
      onTapRoute: (item) => '/sales/${item.id}',
      matches: (item, query) =>
          item.invoiceNumber.toLowerCase().contains(query) ||
          (item.customer?.name.toLowerCase().contains(query) ?? false),
      titleOf: (item) => item.invoiceNumber,
      subtitleOf: (item) =>
          '${item.customer?.name ?? 'Customer'} - ${item.paymentStatus} - Due ${money(item.remainingAmount)}',
      trailing: (item) => Text(money(item.totalAmount)),
    );
  }
}
