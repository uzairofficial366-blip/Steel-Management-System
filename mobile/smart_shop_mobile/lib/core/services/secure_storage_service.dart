import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _tokenKey = 'smart_shop_token';
  static const _apiBaseUrlKey = 'smart_shop_api_base_url';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<String?> readToken() => _storage.read(key: _tokenKey);
  Future<void> saveToken(String token) =>
      _storage.write(key: _tokenKey, value: token);
  Future<void> clearToken() => _storage.delete(key: _tokenKey);

  Future<String?> readApiBaseUrl() => _storage.read(key: _apiBaseUrlKey);
  Future<void> saveApiBaseUrl(String url) =>
      _storage.write(key: _apiBaseUrlKey, value: url);
}
