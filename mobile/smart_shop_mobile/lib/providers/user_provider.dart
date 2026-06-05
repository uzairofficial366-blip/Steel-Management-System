import '../models/user_model.dart';
import 'base_list_provider.dart';

class UserProvider extends BaseListProvider<User> {
  UserProvider(super.api);

  @override
  String get endpoint => '/users';
  @override
  String get responseKey => 'users';
  @override
  User fromJson(Map<String, dynamic> json) => User.fromJson(json);

  Future<bool> updatePassword(String id, String password) async {
    try {
      await api.dio.put('/users/$id/password', data: {'password': password});
      return true;
    } catch (e) {
      error = api.message(e);
      notifyListeners();
      return false;
    }
  }
}
