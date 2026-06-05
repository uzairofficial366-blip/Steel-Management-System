import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/iron_button.dart';
import '../../models/customer_model.dart';
import '../../models/product_model.dart';
import '../../providers/customer_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/sale_provider.dart';

class CreateSaleScreen extends StatefulWidget {
  const CreateSaleScreen({super.key});

  @override
  State<CreateSaleScreen> createState() => _CreateSaleScreenState();
}

class _CreateSaleScreenState extends State<CreateSaleScreen> {
  Customer? customer;
  Product? product;
  final qty = TextEditingController(text: '1');
  final price = TextEditingController();
  final paid = TextEditingController(text: '0');
  bool saving = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().fetch();
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
    if (customer == null || product == null) return;
    setState(() => saving = true);
    final ok = await context.read<SaleProvider>().create({
      'customerId': customer!.id,
      'paidAmount': num.tryParse(paid.text) ?? 0,
      'items': [
        {
          'productId': product!.id,
          'quantity': int.tryParse(qty.text) ?? 1,
          'price': num.tryParse(price.text) ?? product!.salePrice,
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
            context.read<SaleProvider>().error ?? 'Unable to create sale',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final customers = context.watch<CustomerProvider>().items;
    final products = context.watch<ProductProvider>().items;
    return Scaffold(
      appBar: AppBar(title: const Text('Create Sale')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<Customer>(
            initialValue: customer,
            decoration: const InputDecoration(labelText: 'Customer'),
            items: customers
                .map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
                .toList(),
            onChanged: (value) => setState(() => customer = value),
          ),
          const SizedBox(height: 14),
          DropdownButtonFormField<Product>(
            initialValue: product,
            decoration: const InputDecoration(labelText: 'Product'),
            items: products
                .map(
                  (p) => DropdownMenuItem(
                    value: p,
                    child: Text('${p.name} (${p.quantity})'),
                  ),
                )
                .toList(),
            onChanged: (value) => setState(() {
              product = value;
              price.text = value?.salePrice.toString() ?? '';
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
            decoration: const InputDecoration(labelText: 'Sale Price'),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: paid,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Paid Amount'),
          ),
          const SizedBox(height: 20),
          IronButton(
            label: 'Create Invoice',
            icon: Icons.receipt_long,
            loading: saving,
            onPressed: save,
          ),
        ],
      ),
    );
  }
}
