import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app.dart';
import 'core/services/api_client.dart';
import 'core/services/secure_storage_service.dart';
import 'providers/auth_provider.dart';
import 'providers/customer_provider.dart';
import 'providers/payment_provider.dart';
import 'providers/product_provider.dart';
import 'providers/purchase_provider.dart';
import 'providers/report_provider.dart';
import 'providers/sale_provider.dart';
import 'providers/supplier_provider.dart';
import 'providers/user_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final storage = SecureStorageService();
  final api = ApiClient(storage);
  await api.loadSavedBaseUrl();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(api, storage)..bootstrap(),
        ),
        ChangeNotifierProvider(create: (_) => ProductProvider(api)),
        ChangeNotifierProvider(create: (_) => CustomerProvider(api)),
        ChangeNotifierProvider(create: (_) => SupplierProvider(api)),
        ChangeNotifierProvider(create: (_) => UserProvider(api)),
        ChangeNotifierProvider(create: (_) => SaleProvider(api)),
        ChangeNotifierProvider(create: (_) => PurchaseProvider(api)),
        ChangeNotifierProvider(create: (_) => PaymentProvider(api)),
        ChangeNotifierProvider(create: (_) => ReportProvider(api)),
      ],
      child: const SmartShopMobileApp(),
    ),
  );
}
