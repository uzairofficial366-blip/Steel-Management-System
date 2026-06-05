import '../models/product_model.dart';
import 'base_list_provider.dart';

class ProductProvider extends BaseListProvider<Product> {
  ProductProvider(super.api);

  @override
  String get endpoint => '/products';
  @override
  String get responseKey => 'products';
  @override
  Product fromJson(Map<String, dynamic> json) => Product.fromJson(json);
}
