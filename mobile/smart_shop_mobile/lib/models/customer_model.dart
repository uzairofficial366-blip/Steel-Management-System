import 'model_utils.dart';

class Customer {
  Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.address,
    required this.openingBalance,
  });

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
    id: asString(json['id']),
    name: asString(json['name']),
    phone: asString(json['phone']),
    address: asString(json['address']),
    openingBalance: asDouble(json['openingBalance']),
  );

  final String id;
  final String name;
  final String phone;
  final String address;
  final double openingBalance;
}
