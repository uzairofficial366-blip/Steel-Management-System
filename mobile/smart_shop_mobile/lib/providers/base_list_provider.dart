import 'package:flutter/foundation.dart';

import '../core/services/api_client.dart';

abstract class BaseListProvider<T> extends ChangeNotifier {
  BaseListProvider(this.api);

  final ApiClient api;
  final List<T> items = [];
  bool loading = false;
  String? error;

  String get endpoint;
  String get responseKey;
  T fromJson(Map<String, dynamic> json);

  Future<void> fetch() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final response = await api.dio.get(endpoint);
      final data = response.data[responseKey] as List? ?? [];
      items
        ..clear()
        ..addAll(data.whereType<Map<String, dynamic>>().map(fromJson));
    } catch (e) {
      error = api.message(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<bool> create(Map<String, dynamic> data) async {
    try {
      await api.dio.post(endpoint, data: data);
      await fetch();
      return true;
    } catch (e) {
      error = api.message(e);
      notifyListeners();
      return false;
    }
  }

  Future<bool> update(String id, Map<String, dynamic> data) async {
    try {
      await api.dio.put('$endpoint/$id', data: data);
      await fetch();
      return true;
    } catch (e) {
      error = api.message(e);
      notifyListeners();
      return false;
    }
  }

  Future<bool> delete(String id) async {
    try {
      await api.dio.delete('$endpoint/$id');
      await fetch();
      return true;
    } catch (e) {
      error = api.message(e);
      notifyListeners();
      return false;
    }
  }
}
