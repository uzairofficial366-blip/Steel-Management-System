import 'product_model.dart';
import 'sale_model.dart';
import 'model_utils.dart';

class DashboardReport {
  DashboardReport({
    required this.totalStock,
    required this.todaySales,
    required this.monthlySales,
    required this.totalCustomers,
    required this.customerDues,
    required this.supplierDues,
    required this.lowStock,
    required this.recentInvoices,
  });

  factory DashboardReport.fromJson(Map<String, dynamic> json) =>
      DashboardReport(
        totalStock: asInt(json['totalStock']),
        todaySales: asDouble(json['todaySales']),
        monthlySales: asDouble(json['monthlySales']),
        totalCustomers: asInt(json['totalCustomers']),
        customerDues: asDouble(json['customerDues']),
        supplierDues: asDouble(json['supplierDues']),
        lowStock: (json['lowStock'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map(Product.fromJson)
            .toList(),
        recentInvoices: (json['recentInvoices'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map(Sale.fromJson)
            .toList(),
      );

  final int totalStock;
  final double todaySales;
  final double monthlySales;
  final int totalCustomers;
  final double customerDues;
  final double supplierDues;
  final List<Product> lowStock;
  final List<Sale> recentInvoices;
}
