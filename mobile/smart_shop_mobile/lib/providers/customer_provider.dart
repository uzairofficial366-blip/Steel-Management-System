import '../models/customer_model.dart';
import 'base_list_provider.dart';

class CustomerProvider extends BaseListProvider<Customer> {
  CustomerProvider(super.api);

  @override
  String get endpoint => '/customers';
  @override
  String get responseKey => 'customers';
  @override
  Customer fromJson(Map<String, dynamic> json) => Customer.fromJson(json);
}
