import 'customer_model.dart';
import 'model_utils.dart';
import 'supplier_model.dart';

class Payment {
  Payment({
    required this.id,
    required this.amount,
    required this.type,
    this.note,
    this.createdAt,
    this.customer,
    this.supplier,
  });

  factory Payment.fromJson(Map<String, dynamic> json) => Payment(
    id: asString(json['id']),
    amount: asDouble(json['amount']),
    type: asString(json['type']),
    note: json['note']?.toString(),
    createdAt: asDate(json['createdAt']),
    customer: json['customer'] is Map<String, dynamic>
        ? Customer.fromJson(json['customer'] as Map<String, dynamic>)
        : null,
    supplier: json['supplier'] is Map<String, dynamic>
        ? Supplier.fromJson(json['supplier'] as Map<String, dynamic>)
        : null,
  );

  final String id;
  final double amount;
  final String type;
  final String? note;
  final DateTime? createdAt;
  final Customer? customer;
  final Supplier? supplier;
}
