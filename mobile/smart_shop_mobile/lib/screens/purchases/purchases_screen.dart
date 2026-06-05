import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../core/widgets/money_text.dart';
import '../../models/purchase_model.dart';
import '../../providers/purchase_provider.dart';

class PurchasesScreen extends StatelessWidget {
  const PurchasesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Purchase, PurchaseProvider>(
      title: 'Purchases',
      searchHint: 'Search purchases',
      addRoute: '/purchases/new',
      canEdit: false,
      canDelete: false,
      matches: (item, query) =>
          item.invoiceNumber.toLowerCase().contains(query) ||
          (item.supplier?.name.toLowerCase().contains(query) ?? false),
      titleOf: (item) => item.invoiceNumber,
      subtitleOf: (item) =>
          '${item.supplier?.name ?? 'Supplier'} - ${item.paymentStatus} - Due ${money(item.remainingAmount)}',
      trailing: (item) => Text(money(item.totalAmount)),
    );
  }
}
