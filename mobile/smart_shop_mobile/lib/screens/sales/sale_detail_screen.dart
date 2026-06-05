import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../core/widgets/iron_card.dart';
import '../../core/widgets/loading_view.dart';
import '../../core/widgets/money_text.dart';
import '../../models/sale_model.dart';
import '../../providers/sale_provider.dart';

class SaleDetailScreen extends StatelessWidget {
  const SaleDetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Sale?>(
      future: context.read<SaleProvider>().fetchOne(id),
      builder: (context, snapshot) {
        final sale = snapshot.data;
        return Scaffold(
          appBar: AppBar(title: Text(sale?.invoiceNumber ?? 'Invoice')),
          body: snapshot.connectionState == ConnectionState.waiting
              ? const LoadingView()
              : sale == null
              ? const Center(child: Text('Invoice not found'))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    IronCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            sale.invoiceNumber,
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '${sale.customer?.name ?? 'Customer'} - ${sale.createdAt == null ? '' : DateFormat.yMMMd().format(sale.createdAt!)}',
                          ),
                          const Divider(),
                          _line('Total', money(sale.totalAmount)),
                          _line('Paid', money(sale.paidAmount)),
                          _line('Remaining', money(sale.remainingAmount)),
                          _line('Status', sale.paymentStatus),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...sale.items.map(
                      (item) => IronCard(
                        child: ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(item.product?.name ?? 'Product'),
                          subtitle: Text(
                            'Qty ${item.quantity} x ${money(item.price)}',
                          ),
                          trailing: Text(money(item.subtotal)),
                        ),
                      ),
                    ),
                  ],
                ),
        );
      },
    );
  }

  Widget _line(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 5),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
      ],
    ),
  );
}
