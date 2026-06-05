import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/widgets/iron_button.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final userId = TextEditingController();
  final password = TextEditingController();
  final serverUrl = TextEditingController();
  final formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    userId.dispose();
    password.dispose();
    serverUrl.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    if (!formKey.currentState!.validate()) return;
    final ok = await context.read<AuthProvider>().login(
      userId.text,
      password.text,
    );
    if (!ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(context.read<AuthProvider>().error ?? 'Login failed'),
        ),
      );
    }
  }

  Future<void> editServerUrl() async {
    final auth = context.read<AuthProvider>();
    serverUrl.text = auth.apiBaseUrl;
    final saved = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Server URL'),
        content: TextField(
          controller: serverUrl,
          keyboardType: TextInputType.url,
          decoration: const InputDecoration(
            labelText: 'API URL',
            hintText: 'http://192.168.18.54:5000/api',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (saved == true && mounted) {
      await auth.updateApiBaseUrl(serverUrl.text);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Server URL saved. Login again.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(22),
          children: [
            const SizedBox(height: 42),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: .14),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.local_fire_department,
                color: AppColors.primary,
                size: 36,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'New Steel',
              style: Theme.of(
                context,
              ).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            const Text(
              'Iron Forge business dashboard',
              style: TextStyle(color: AppColors.textMuted),
            ),
            const SizedBox(height: 34),
            Form(
              key: formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: userId,
                    decoration: const InputDecoration(
                      labelText: 'User ID',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                    validator: _required,
                  ),
                  const SizedBox(height: 14),
                  TextFormField(
                    controller: password,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      prefixIcon: Icon(Icons.lock_outline),
                    ),
                    validator: _required,
                  ),
                  const SizedBox(height: 22),
                  IronButton(
                    label: 'Sign in',
                    icon: Icons.login,
                    loading: auth.loading,
                    onPressed: submit,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            const Text(
              'Demo: admin / Admin@123',
              style: TextStyle(color: AppColors.textMuted),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 14),
            TextButton.icon(
              onPressed: editServerUrl,
              icon: const Icon(Icons.settings_ethernet),
              label: Text('Server: ${auth.apiBaseUrl}'),
            ),
          ],
        ),
      ),
    );
  }

  String? _required(String? value) =>
      value == null || value.trim().isEmpty ? 'Required' : null;
}
