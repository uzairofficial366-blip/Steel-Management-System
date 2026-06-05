import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/iron_button.dart';
import '../../models/customer_model.dart';
import '../../models/supplier_model.dart';
import '../../providers/customer_provider.dart';
import '../../providers/payment_provider.dart';
import '../../providers/supplier_provider.dart';

class CreatePaymentScreen extends StatefulWidget {
  const CreatePaymentScreen({super.key});

  @override
  State<CreatePaymentScreen> createState() => _CreatePaymentScreenState();
}

class _CreatePaymentScreenState extends State<CreatePaymentScreen> {
  String type = 'CUSTOMER_PAYMENT';
  Customer? customer;
  Supplier? supplier;
  final amount = TextEditingController();
  final note = TextEditingController();
  bool saving = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CustomerProvider>().fetch();
      context.read<SupplierProvider>().fetch();
    });
  }

  @override
  void dispose() {
    amount.dispose();
    note.dispose();
    super.dispose();
  }

  Future<void> save() async {
    setState(() => saving = true);
    final ok = await context.read<PaymentProvider>().create({
      'type': type,
      'amount': num.tryParse(amount.text) ?? 0,
      'note': note.text,
      'customerId': type == 'CUSTOMER_PAYMENT' ? customer?.id : null,
      'supplierId': type == 'SUPPLIER_PAYMENT' ? supplier?.id : null,
    });
    setState(() => saving = false);
    if (!mounted) return;
    if (ok) {
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.read<PaymentProvider>().error ?? 'Unable to save payment',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final customers = context.watch<CustomerProvider>().items;
    final suppliers = context.watch<SupplierProvider>().items;
    return Scaffold(
      appBar: AppBar(title: const Text('New Payment')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: type,
            decoration: const InputDecoration(labelText: 'Type'),
            items: const ['CUSTOMER_PAYMENT', 'SUPPLIER_PAYMENT', 'EXPENSE']
                .map(
                  (v) => DropdownMenuItem(
                    value: v,
                    child: Text(v.replaceAll('_', ' ')),
                  ),
                )
                .toList(),
            onChanged: (value) => setState(() => type = value ?? type),
          ),
          const SizedBox(height: 14),
          if (type == 'CUSTOMER_PAYMENT')
            DropdownButtonFormField<Customer>(
              initialValue: customer,
              decoration: const InputDecoration(labelText: 'Customer'),
              items: customers
                  .map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
                  .toList(),
              onChanged: (value) => setState(() => customer = value),
            ),
          if (type == 'SUPPLIER_PAYMENT')
            DropdownButtonFormField<Supplier>(
              initialValue: supplier,
              decoration: const InputDecoration(labelText: 'Supplier'),
              items: suppliers
                  .map((s) => DropdownMenuItem(value: s, child: Text(s.name)))
                  .toList(),
              onChanged: (value) => setState(() => supplier = value),
            ),
          const SizedBox(height: 14),
          TextField(
            controller: amount,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Amount'),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: note,
            decoration: const InputDecoration(labelText: 'Note'),
          ),
          const SizedBox(height: 20),
          IronButton(
            label: 'Save Payment',
            icon: Icons.payments,
            loading: saving,
            onPressed: save,
          ),
        ],
      ),
    );
  }
}
