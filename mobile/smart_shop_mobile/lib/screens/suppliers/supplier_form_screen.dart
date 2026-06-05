import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/entity_form_screen.dart';
import '../../models/supplier_model.dart';
import '../../providers/supplier_provider.dart';

class SupplierFormScreen extends StatelessWidget {
  const SupplierFormScreen({super.key, this.id});
  final String? id;

  @override
  Widget build(BuildContext context) {
    final item = id == null
        ? null
        : context
              .read<SupplierProvider>()
              .items
              .where((p) => p.id == id)
              .firstOrNull;
    return EntityFormScreen<Supplier, SupplierProvider>(
      title: id == null ? 'Add Supplier' : 'Edit Supplier',
      id: id,
      fields: [
        EntityField(
          key: 'name',
          label: 'Name',
          required: true,
          initialValue: item?.name ?? '',
        ),
        EntityField(
          key: 'phone',
          label: 'Phone',
          required: true,
          keyboardType: TextInputType.phone,
          initialValue: item?.phone ?? '',
        ),
        EntityField(
          key: 'address',
          label: 'Address',
          initialValue: item?.address ?? '',
        ),
      ],
    );
  }
}
