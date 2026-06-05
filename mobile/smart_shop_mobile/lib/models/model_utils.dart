double asDouble(dynamic value) => double.tryParse('${value ?? 0}') ?? 0;
int asInt(dynamic value) => int.tryParse('${value ?? 0}') ?? 0;
String asString(dynamic value) => value?.toString() ?? '';

DateTime? asDate(dynamic value) {
  if (value == null) return null;
  return DateTime.tryParse(value.toString());
}
