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

  static const _staleLocalBaseUrls = {
    'http://192.168.1.105:5000/api',
    'http://192.168.18.54:5000/api',
  };

  String get baseUrl => dio.options.baseUrl;

  Future<void> loadSavedBaseUrl() async {
    if (AppConfig.hasApiBaseUrlOverride) {
      final normalized = _normalizeBaseUrl(AppConfig.apiBaseUrl);
      dio.options.baseUrl = normalized;
      await _storage.saveApiBaseUrl(normalized);
      return;
    }

    final savedUrl = await _storage.readApiBaseUrl();
    if (savedUrl != null && savedUrl.isNotEmpty) {
      final normalized = _normalizeBaseUrl(savedUrl);
      if (!_staleLocalBaseUrls.contains(normalized)) {
        dio.options.baseUrl = normalized;
        return;
      }
    }

    dio.options.baseUrl = _normalizeBaseUrl(AppConfig.apiBaseUrl);
  }

  Future<void> updateBaseUrl(String url) async {
    final normalized = _normalizeBaseUrl(url);
    dio.options.baseUrl = normalized;
    await _storage.saveApiBaseUrl(normalized);
    await _storage.clearToken();
  }

  String _normalizeBaseUrl(String url) {
    final trimmed = url.trim().replaceAll(RegExp(r'/+$'), '');
    final parsed = Uri.tryParse(trimmed);
    if (parsed == null || !parsed.hasScheme || parsed.host.isEmpty) {
      return trimmed;
    }

    if (parsed.path.isEmpty || parsed.path == '/') {
      return parsed
          .replace(path: '/api')
          .toString()
          .replaceAll(RegExp(r'/+$'), '');
    }

    return trimmed;
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
