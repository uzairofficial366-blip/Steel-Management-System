import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:smart_shop_mobile/app.dart';
import 'package:smart_shop_mobile/core/services/api_client.dart';
import 'package:smart_shop_mobile/core/services/secure_storage_service.dart';
import 'package:smart_shop_mobile/providers/auth_provider.dart';

void main() {
  testWidgets('builds Smart Shop app shell', (tester) async {
    final storage = SecureStorageService();
    final api = ApiClient(storage);
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AuthProvider(api, storage),
        child: const SmartShopMobileApp(),
      ),
    );

    expect(find.text('Smart Shop'), findsWidgets);
  });
}
