import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.storefront, color: AppColors.primary, size: 54),
            SizedBox(height: 16),
            Text(
              'Smart Shop',
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900),
            ),
            SizedBox(height: 18),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
