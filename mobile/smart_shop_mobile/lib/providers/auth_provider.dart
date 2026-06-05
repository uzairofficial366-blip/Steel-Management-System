import 'package:flutter/foundation.dart';

import '../core/services/api_client.dart';
import '../core/services/secure_storage_service.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider(this._api, this._storage);

  final ApiClient _api;
  final SecureStorageService _storage;

  User? user;
  bool loading = true;
  String? error;

  bool get isAuthenticated => user != null;
  String get apiBaseUrl => _api.baseUrl;

  Future<void> updateApiBaseUrl(String url) async {
    await _api.updateBaseUrl(url);
    user = null;
    error = null;
    notifyListeners();
  }

  Future<void> bootstrap() async {
    loading = true;
    notifyListeners();
    final token = await _storage.readToken();
    if (token == null || token.isEmpty) {
      loading = false;
      notifyListeners();
      return;
    }
    try {
      final response = await _api.dio.get('/auth/me');
      user = User.fromJson(Map<String, dynamic>.from(response.data['user']));
      error = null;
    } catch (e) {
      await _storage.clearToken();
      user = null;
      error = _api.message(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String userId, String password) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final response = await _api.dio.post(
        '/auth/login',
        data: {'userId': userId.trim(), 'password': password.trim()},
      );
      await _storage.saveToken(response.data['token'].toString());
      user = User.fromJson(Map<String, dynamic>.from(response.data['user']));
      return true;
    } catch (e) {
      error = _api.message(e);
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _storage.clearToken();
    user = null;
    notifyListeners();
  }
}
