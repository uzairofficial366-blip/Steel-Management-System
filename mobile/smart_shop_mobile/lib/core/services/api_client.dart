import 'package:dio/dio.dart';

import '../config/app_config.dart';
import 'secure_storage_service.dart';

class ApiClient {
  ApiClient(this._storage)
    : dio = Dio(
        BaseOptions(
          baseUrl: AppConfig.apiBaseUrl,
          connectTimeout: const Duration(seconds: 20),
          receiveTimeout: const Duration(seconds: 20),
          headers: {'Accept': 'application/json'},
        ),
      ) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.readToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
    );
  }

  final SecureStorageService _storage;
  final Dio dio;

  String get baseUrl => dio.options.baseUrl;

  Future<void> loadSavedBaseUrl() async {
    final savedUrl = await _storage.readApiBaseUrl();
    if (savedUrl != null && savedUrl.isNotEmpty) {
      dio.options.baseUrl = savedUrl;
    }
  }

  Future<void> updateBaseUrl(String url) async {
    final normalized = url.trim().replaceAll(RegExp(r'/+$'), '');
    dio.options.baseUrl = normalized;
    await _storage.saveApiBaseUrl(normalized);
    await _storage.clearToken();
  }

  String message(Object error) {
    if (error is DioException) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        return data['message'].toString();
      }
      if (data is Map && data['error'] != null) {
        return data['error'].toString();
      }
      return error.message ?? 'Network error';
    }
    return error.toString();
  }
}
