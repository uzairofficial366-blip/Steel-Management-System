import 'model_utils.dart';

class Product {
  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.purchasePrice,
    required this.salePrice,
    required this.quantity,
    required this.lowStockLimit,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
    id: asString(json['id']),
    name: asString(json['name']),
    category: asString(json['category']),
    purchasePrice: asDouble(json['purchasePrice']),
    salePrice: asDouble(json['salePrice']),
    quantity: asInt(json['quantity']),
    lowStockLimit: asInt(json['lowStockLimit']),
  );

  final String id;
  final String name;
  final String category;
  final double purchasePrice;
  final double salePrice;
  final int quantity;
  final int lowStockLimit;
}
