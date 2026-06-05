import '../models/supplier_model.dart';
import 'base_list_provider.dart';

class SupplierProvider extends BaseListProvider<Supplier> {
  SupplierProvider(super.api);

  @override
  String get endpoint => '/suppliers';
  @override
  String get responseKey => 'suppliers';
  @override
  Supplier fromJson(Map<String, dynamic> json) => Supplier.fromJson(json);
}
