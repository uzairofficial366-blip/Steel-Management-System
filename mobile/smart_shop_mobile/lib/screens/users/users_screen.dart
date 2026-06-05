import 'package:flutter/material.dart';

import '../../core/widgets/module_list_screen.dart';
import '../../models/user_model.dart';
import '../../providers/user_provider.dart';

class UsersScreen extends StatelessWidget {
  const UsersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ModuleListScreen<User, UserProvider>(
      title: 'Users',
      searchHint: 'Search users',
      addRoute: '/users/new',
      editRoute: (item) => '/users/${item.id}',
      idOf: (item) => item.id,
      matches: (item, query) =>
          item.name.toLowerCase().contains(query) ||
          item.userId.toLowerCase().contains(query) ||
          item.role.api.toLowerCase().contains(query),
      titleOf: (item) => item.name,
      subtitleOf: (item) =>
          '${item.userId} - ${item.role.api} - ${item.isActive ? 'Active' : 'Inactive'}',
    );
  }
}
