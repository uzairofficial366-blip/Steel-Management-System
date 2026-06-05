import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../models/supplier_model.dart';
import '../../providers/supplier_provider.dart';

class SuppliersScreen extends StatelessWidget {
  const SuppliersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Supplier, SupplierProvider>(
      title: 'Suppliers',
      searchHint: 'Search suppliers',
      addRoute: '/suppliers/new',
      editRoute: (item) => '/suppliers/${item.id}',
      idOf: (item) => item.id,
      matches: (item, query) =>
          item.name.toLowerCase().contains(query) ||
          item.phone.toLowerCase().contains(query),
      titleOf: (item) => item.name,
      subtitleOf: (item) => '${item.phone} - ${item.address}',
    );
  }
}
