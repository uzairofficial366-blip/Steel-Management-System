import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../models/customer_model.dart';
import '../../providers/customer_provider.dart';

class CustomersScreen extends StatelessWidget {
  const CustomersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Customer, CustomerProvider>(
      title: 'Customers',
      searchHint: 'Search customers',
      addRoute: '/customers/new',
      editRoute: (item) => '/customers/${item.id}',
      idOf: (item) => item.id,
      matches: (item, query) =>
          item.name.toLowerCase().contains(query) ||
          item.phone.toLowerCase().contains(query),
      titleOf: (item) => item.name,
      subtitleOf: (item) => '${item.phone} - ${item.address}',
    );
  }
}
