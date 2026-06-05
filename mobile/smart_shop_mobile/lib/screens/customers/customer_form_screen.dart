import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/entity_form_screen.dart';
import '../../models/customer_model.dart';
import '../../providers/customer_provider.dart';

class CustomerFormScreen extends StatelessWidget {
  const CustomerFormScreen({super.key, this.id});
  final String? id;

  @override
  Widget build(BuildContext context) {
    final item = id == null
        ? null
        : context
              .read<CustomerProvider>()
              .items
              .where((p) => p.id == id)
              .firstOrNull;
    return EntityFormScreen<Customer, CustomerProvider>(
      title: id == null ? 'Add Customer' : 'Edit Customer',
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
        EntityField(
          key: 'openingBalance',
          label: 'Opening Balance',
          keyboardType: TextInputType.number,
          initialValue: item?.openingBalance.toString() ?? '0',
        ),
      ],
    );
  }
}
