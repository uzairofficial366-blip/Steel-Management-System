import '../models/purchase_model.dart';
import 'base_list_provider.dart';

class PurchaseProvider extends BaseListProvider<Purchase> {
  PurchaseProvider(super.api);

  @override
  String get endpoint => '/purchases';
  @override
  String get responseKey => 'purchases';
  @override
  Purchase fromJson(Map<String, dynamic> json) => Purchase.fromJson(json);
}
