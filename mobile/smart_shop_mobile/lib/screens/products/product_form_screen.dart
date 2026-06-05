import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/entity_form_screen.dart';
import '../../models/product_model.dart';
import '../../providers/product_provider.dart';

class ProductFormScreen extends StatelessWidget {
  const ProductFormScreen({super.key, this.id});
  final String? id;

  @override
  Widget build(BuildContext context) {
    final item = id == null
        ? null
        : context
              .read<ProductProvider>()
              .items
              .where((p) => p.id == id)
              .firstOrNull;
    return EntityFormScreen<Product, ProductProvider>(
      title: id == null ? 'Add Product' : 'Edit Product',
      id: id,
      fields: [
        EntityField(
          key: 'name',
          label: 'Name',
          required: true,
          initialValue: item?.name ?? '',
        ),
        EntityField(
          key: 'category',
          label: 'Category',
          required: true,
          initialValue: item?.category ?? '',
        ),
        EntityField(
          key: 'purchasePrice',
          label: 'Purchase Price',
          keyboardType: TextInputType.number,
          initialValue: item?.purchasePrice.toString() ?? '0',
        ),
        EntityField(
          key: 'salePrice',
          label: 'Sale Price',
          keyboardType: TextInputType.number,
          initialValue: item?.salePrice.toString() ?? '0',
        ),
        EntityField(
          key: 'quantity',
          label: 'Quantity',
          keyboardType: TextInputType.number,
          initialValue: item?.quantity.toString() ?? '0',
        ),
        EntityField(
          key: 'lowStockLimit',
          label: 'Low Stock Limit',
          keyboardType: TextInputType.number,
          initialValue: item?.lowStockLimit.toString() ?? '5',
        ),
      ],
    );
  }
}
