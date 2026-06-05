import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/base_list_provider.dart';
import 'iron_button.dart';

class EntityField {
  const EntityField({
    required this.key,
    required this.label,
    this.initialValue = '',
    this.keyboardType,
    this.required = false,
    this.obscure = false,
  });

  final String key;
  final String label;
  final String initialValue;
  final TextInputType? keyboardType;
  final bool required;
  final bool obscure;
}

class EntityFormScreen<T, P extends BaseListProvider<T>>
    extends StatefulWidget {
  const EntityFormScreen({
    super.key,
    required this.title,
    required this.fields,
    this.id,
    this.extraData = const {},
  });

  final String title;
  final List<EntityField> fields;
  final String? id;
  final Map<String, dynamic> extraData;

  @override
  State<EntityFormScreen<T, P>> createState() => _EntityFormScreenState<T, P>();
}

class _EntityFormScreenState<T, P extends BaseListProvider<T>>
    extends State<EntityFormScreen<T, P>> {
  final formKey = GlobalKey<FormState>();
  late final Map<String, TextEditingController> controllers = {
    for (final field in widget.fields)
      field.key: TextEditingController(text: field.initialValue),
  };
  bool saving = false;

  @override
  void dispose() {
    for (final controller in controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> save() async {
    if (!formKey.currentState!.validate()) return;
    setState(() => saving = true);
    final provider = context.read<P>();
    final data = <String, dynamic>{...widget.extraData};
    for (final field in widget.fields) {
      data[field.key] = controllers[field.key]!.text.trim();
    }
    final ok = widget.id == null
        ? await provider.create(data)
        : await provider.update(widget.id!, data);
    setState(() => saving = false);
    if (!mounted) return;
    if (ok) {
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.error ?? 'Unable to save')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Form(
        key: formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            ...widget.fields.map(
              (field) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: TextFormField(
                  controller: controllers[field.key],
                  obscureText: field.obscure,
                  keyboardType: field.keyboardType,
                  decoration: InputDecoration(labelText: field.label),
                  validator: (value) =>
                      field.required && (value == null || value.trim().isEmpty)
                      ? '${field.label} is required'
                      : null,
                ),
              ),
            ),
            IronButton(
              label: 'Save',
              icon: Icons.check,
              loading: saving,
              onPressed: save,
            ),
          ],
        ),
      ),
    );
  }
}
