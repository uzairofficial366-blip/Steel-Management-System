import 'model_utils.dart';

class KhataEntry {
  KhataEntry({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    this.createdAt,
  });

  factory KhataEntry.fromJson(Map<String, dynamic> json) => KhataEntry(
    id: asString(json['id']),
    type: asString(json['type']),
    amount: asDouble(json['amount']),
    description: asString(json['description']),
    createdAt: asDate(json['createdAt']),
  );

  final String id;
  final String type;
  final double amount;
  final String description;
  final DateTime? createdAt;
}
