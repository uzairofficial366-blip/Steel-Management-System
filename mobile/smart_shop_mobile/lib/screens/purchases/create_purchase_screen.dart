import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/iron_button.dart';
import '../../models/product_model.dart';
import '../../models/supplier_model.dart';
import '../../providers/product_provider.dart';
import '../../providers/purchase_provider.dart';
import '../../providers/supplier_provider.dart';

class CreatePurchaseScreen extends StatefulWidget {
  const CreatePurchaseScreen({super.key});

  @override
  State<CreatePurchaseScreen> createState() => _CreatePurchaseScreenState();
}

class _CreatePurchaseScreenState extends State<CreatePurchaseScreen> {
  Supplier? supplier;
  Product? product;
  final qty = TextEditingController(text: '1');
  final price = TextEditingController();
  final paid = TextEditingController(text: '0');
  bool saving = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SupplierProvider>().fetch();
      context.read<ProductProvider>().fetch();
    });
  }

  @override
  void dispose() {
    qty.dispose();
    price.dispose();
    paid.dispose();
    super.dispose();
  }

  Future<void> save() async {
    if (supplier == null || product == null) return;
    setState(() => saving = true);
    final ok = await context.read<PurchaseProvider>().create({
      'supplierId': supplier!.id,
      'paidAmount': num.tryParse(paid.text) ?? 0,
      'items': [
        {
          'productId': product!.id,
          'quantity': int.tryParse(qty.text) ?? 1,
          'purchasePrice': num.tryParse(price.text) ?? product!.purchasePrice,
        },
      ],
    });
    setState(() => saving = false);
    if (!mounted) return;
    if (ok) {
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.read<PurchaseProvider>().error ??
                'Unable to create purchase',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final suppliers = context.watch<SupplierProvider>().items;
    final products = context.watch<ProductProvider>().items;
    return Scaffold(
      appBar: AppBar(title: const Text('Create Purchase')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<Supplier>(
            initialValue: supplier,
            decoration: const InputDecoration(labelText: 'Supplier'),
            items: suppliers
                .map((s) => DropdownMenuItem(value: s, child: Text(s.name)))
                .toList(),
            onChanged: (value) => setState(() => supplier = value),
          ),
          const SizedBox(height: 14),
          DropdownButtonFormField<Product>(
            initialValue: product,
            decoration: const InputDecoration(labelText: 'Product'),
            items: products
                .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                .toList(),
            onChanged: (value) => setState(() {
              product = value;
              price.text = value?.purchasePrice.toString() ?? '';
            }),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: qty,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Quantity'),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: price,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Purchase Price'),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: paid,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Paid Amount'),
          ),
          const SizedBox(height: 20),
          IronButton(
            label: 'Create Purchase',
            icon: Icons.shopping_bag,
            loading: saving,
            onPressed: save,
          ),
        ],
      ),
    );
  }
}
