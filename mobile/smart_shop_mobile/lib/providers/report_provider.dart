import 'package:flutter/foundation.dart';

import '../core/services/api_client.dart';
import '../models/khata_model.dart';
import '../models/report_model.dart';

class ReportProvider extends ChangeNotifier {
  ReportProvider(this.api);

  final ApiClient api;
  DashboardReport? dashboard;
  List<dynamic> salesReport = [];
  Map<String, dynamic>? profitLoss;
  List<dynamic> customerDues = [];
  List<dynamic> supplierDues = [];
  List<KhataEntry> khataEntries = [];
  double khataBalance = 0;
  bool loading = false;
  String? error;

  Future<void> fetchDashboard() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final response = await api.dio.get('/reports/dashboard');
      dashboard = DashboardReport.fromJson(
        Map<String, dynamic>.from(response.data),
      );
    } catch (e) {
      error = api.message(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> fetchReports() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final responses = await Future.wait([
        api.dio.get('/reports/sales'),
        api.dio.get('/reports/profit-loss'),
        api.dio.get('/reports/customer-dues'),
        api.dio.get('/reports/supplier-dues'),
      ]);
      salesReport = responses[0].data['sales'] as List? ?? [];
      profitLoss = Map<String, dynamic>.from(responses[1].data);
      customerDues = responses[2].data['dues'] as List? ?? [];
      supplierDues = responses[3].data['dues'] as List? ?? [];
    } catch (e) {
      error = api.message(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> fetchKhata(String customerId) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final response = await api.dio.get('/khata/customer/$customerId');
      khataBalance = double.tryParse('${response.data['balance'] ?? 0}') ?? 0;
      khataEntries = (response.data['entries'] as List? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(KhataEntry.fromJson)
          .toList();
    } catch (e) {
      error = api.message(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<bool> createKhata(Map<String, dynamic> data) async {
    try {
      await api.dio.post('/khata', data: data);
      return true;
    } catch (e) {
      error = api.message(e);
      notifyListeners();
      return false;
    }
  }
}
