import 'package:intl/intl.dart';

final _moneyFormat = NumberFormat('#,##0.##');

String money(num value) => _moneyFormat.format(value);
