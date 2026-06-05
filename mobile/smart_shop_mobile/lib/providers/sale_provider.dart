import '../models/sale_model.dart';
import 'base_list_provider.dart';

class SaleProvider extends BaseListProvider<Sale> {
  SaleProvider(super.api);

  @override
  String get endpoint => '/sales';
  @override
  String get responseKey => 'sales';
  @override
  Sale fromJson(Map<String, dynamic> json) => Sale.fromJson(json);

  Future<Sale?> fetchOne(String id) async {
    final response = await api.dio.get('/sales/$id');
    return Sale.fromJson(Map<String, dynamic>.from(response.data['sale']));
  }
}
