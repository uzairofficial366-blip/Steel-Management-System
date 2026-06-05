import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/entity_form_screen.dart';
import '../../models/user_model.dart';
import '../../providers/user_provider.dart';

class UserFormScreen extends StatelessWidget {
  const UserFormScreen({super.key, this.id});
  final String? id;

  @override
  Widget build(BuildContext context) {
    final item = id == null
        ? null
        : context
              .read<UserProvider>()
              .items
              .where((p) => p.id == id)
              .firstOrNull;
    return EntityFormScreen<User, UserProvider>(
      title: id == null ? 'Add User' : 'Edit User',
      id: id,
      extraData: {
        'role': item?.role.api ?? 'SALESMAN',
        'isActive': item?.isActive ?? true,
      },
      fields: [
        if (id == null)
          EntityField(
            key: 'userId',
            label: 'User ID',
            required: true,
            initialValue: item?.userId ?? '',
          ),
        EntityField(
          key: 'name',
          label: 'Name',
          required: true,
          initialValue: item?.name ?? '',
        ),
        if (id == null)
          const EntityField(
            key: 'password',
            label: 'Password',
            required: true,
            obscure: true,
          ),
        EntityField(
          key: 'role',
          label: 'Role (ADMIN, MANAGER, SALESMAN, ACCOUNTANT, CUSTOMER)',
          initialValue: item?.role.api ?? 'SALESMAN',
        ),
        EntityField(
          key: 'customerId',
          label: 'Customer ID for CUSTOMER role',
          initialValue: item?.customerId ?? '',
        ),
      ],
    );
  }
}
