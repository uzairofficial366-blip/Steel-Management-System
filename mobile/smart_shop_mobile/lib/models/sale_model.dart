import 'customer_model.dart';
import 'model_utils.dart';
import 'product_model.dart';

class SaleItem {
  SaleItem({
    required this.id,
    required this.quantity,
    required this.price,
    required this.subtotal,
    this.product,
  });

  factory SaleItem.fromJson(Map<String, dynamic> json) => SaleItem(
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

class Sale {
  Sale({
    required this.id,
    required this.invoiceNumber,
    required this.totalAmount,
    required this.paidAmount,
    required this.remainingAmount,
    required this.paymentStatus,
    this.createdAt,
    this.customer,
    required this.items,
  });

  factory Sale.fromJson(Map<String, dynamic> json) => Sale(
    id: asString(json['id']),
    invoiceNumber: asString(json['invoiceNumber']),
    totalAmount: asDouble(json['totalAmount']),
    paidAmount: asDouble(json['paidAmount']),
    remainingAmount: asDouble(json['remainingAmount']),
    paymentStatus: asString(json['paymentStatus']),
    createdAt: asDate(json['createdAt']),
    customer: json['customer'] is Map<String, dynamic>
        ? Customer.fromJson(json['customer'] as Map<String, dynamic>)
        : null,
    items: (json['items'] as List? ?? [])
        .whereType<Map<String, dynamic>>()
        .map(SaleItem.fromJson)
        .toList(),
  );

  final String id;
  final String invoiceNumber;
  final double totalAmount;
  final double paidAmount;
  final double remainingAmount;
  final String paymentStatus;
  final DateTime? createdAt;
  final Customer? customer;
  final List<SaleItem> items;
}
