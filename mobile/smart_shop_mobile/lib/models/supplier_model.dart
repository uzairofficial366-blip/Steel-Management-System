import 'model_utils.dart';

class Supplier {
  Supplier({
    required this.id,
    required this.name,
    required this.phone,
    required this.address,
  });

  factory Supplier.fromJson(Map<String, dynamic> json) => Supplier(
    id: asString(json['id']),
    name: asString(json['name']),
    phone: asString(json['phone']),
    address: asString(json['address']),
  );

  final String id;
  final String name;
  final String phone;
  final String address;
}
