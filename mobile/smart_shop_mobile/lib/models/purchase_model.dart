import 'model_utils.dart';
import 'product_model.dart';
import 'supplier_model.dart';

class PurchaseItem {
  PurchaseItem({
    required this.id,
    required this.quantity,
    required this.price,
    required this.subtotal,
    this.product,
  });

  factory PurchaseItem.fromJson(Map<String, dynamic> json) => PurchaseItem(
    id: asString(json['id']),
    quantity: asInt(json['quantity']),
    price: asDouble(json['price']),
    subtotal: asDouble(json['subtotal']),
    product: json['product'] is Map<String, dynamic>
        ? Product.fromJson(json['product'] as Map<String, dynamic>)
        : null,
  );

  final String id;
  final int quantity;
  final double price;
  final double subtotal;
  final Product? product;
}

class Purchase {
  Purchase({
    required this.id,
    required this.invoiceNumber,
    required this.totalAmount,
    required this.paidAmount,
    required this.remainingAmount,
    required this.paymentStatus,
    this.createdAt,
    this.supplier,
    required this.items,
  });

  factory Purchase.fromJson(Map<String, dynamic> json) => Purchase(
    id: asString(json['id']),
    invoiceNumber: asString(json['invoiceNumber']),
    totalAmount: asDouble(json['totalAmount']),
    paidAmount: asDouble(json['paidAmount']),
    remainingAmount: asDouble(json['remainingAmount']),
    paymentStatus: asString(json['paymentStatus']),
    createdAt: asDate(json['createdAt']),
    supplier: json['supplier'] is Map<String, dynamic>
        ? Supplier.fromJson(json['supplier'] as Map<String, dynamic>)
        : null,
    items: (json['items'] as List? ?? [])
        .whereType<Map<String, dynamic>>()
        .map(PurchaseItem.fromJson)
        .toList(),
  );

  final String id;
  final String invoiceNumber;
  final double totalAmount;
  final double paidAmount;
  final double remainingAmount;
  final String paymentStatus;
  final DateTime? createdAt;
  final Supplier? supplier;
  final List<PurchaseItem> items;
}
