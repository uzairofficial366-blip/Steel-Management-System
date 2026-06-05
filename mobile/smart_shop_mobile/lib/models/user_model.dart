import 'customer_model.dart';
import 'model_utils.dart';

enum Role { admin, manager, salesman, accountant, customer }

Role roleFromString(String value) => Role.values.firstWhere(
  (role) => role.name.toUpperCase() == value,
  orElse: () => Role.salesman,
);

extension RoleLabel on Role {
  String get api => name.toUpperCase();
  String get title => '${api[0]}${api.substring(1).toLowerCase()}';
}

class User {
  User({
    required this.id,
    required this.userId,
    required this.name,
    required this.role,
    required this.isActive,
    this.customerId,
    this.customer,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: asString(json['id']),
    userId: asString(json['userId']),
    name: asString(json['name']),
    role: roleFromString(asString(json['role'])),
    isActive: json['isActive'] != false,
    customerId: json['customerId']?.toString(),
    customer: json['customer'] is Map<String, dynamic>
        ? Customer.fromJson(json['customer'] as Map<String, dynamic>)
        : null,
  );

  final String id;
  final String userId;
  final String name;
  final Role role;
  final bool isActive;
  final String? customerId;
  final Customer? customer;
}
