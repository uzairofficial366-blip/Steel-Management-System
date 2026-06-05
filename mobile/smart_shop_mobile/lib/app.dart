import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'routes/app_router.dart';

class SmartShopMobileApp extends StatefulWidget {
  const SmartShopMobileApp({super.key});

  @override
  State<SmartShopMobileApp> createState() => _SmartShopMobileAppState();
}

class _SmartShopMobileAppState extends State<SmartShopMobileApp> {
  late final AppRouter _router;

  @override
  void initState() {
    super.initState();
    _router = AppRouter(context.read<AuthProvider>());
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Smart Shop Mobile',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      routerConfig: _router.router,
    );
  }
}
