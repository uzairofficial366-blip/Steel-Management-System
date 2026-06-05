import '../models/payment_model.dart';
import 'base_list_provider.dart';

class PaymentProvider extends BaseListProvider<Payment> {
  PaymentProvider(super.api);

  @override
  String get endpoint => '/payments';
  @override
  String get responseKey => 'payments';
  @override
  Payment fromJson(Map<String, dynamic> json) => Payment.fromJson(json);
}
