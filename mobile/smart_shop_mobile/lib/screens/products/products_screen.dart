import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../core/widgets/money_text.dart';
import '../../models/product_model.dart';
import '../../providers/product_provider.dart';

class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<Product, ProductProvider>(
      title: 'Products',
      searchHint: 'Search products',
      addRoute: '/products/new',
      editRoute: (item) => '/products/${item.id}',
      idOf: (item) => item.id,
      matches: (item, query) =>
          item.name.toLowerCase().contains(query) ||
          item.category.toLowerCase().contains(query),
      titleOf: (item) => item.name,
      subtitleOf: (item) =>
          '${item.category} - Stock ${item.quantity} - Sale ${money(item.salePrice)}',
      trailing: (item) => item.quantity <= item.lowStockLimit
          ? const Icon(Icons.warning_amber, color: Colors.amber)
          : const SizedBox.shrink(),
    );
  }
}
