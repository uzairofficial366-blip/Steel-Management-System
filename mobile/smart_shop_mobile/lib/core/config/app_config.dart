class AppConfig {
  static const bool hasApiBaseUrlOverride = bool.hasEnvironment('API_BASE_URL');

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://192.168.18.42:5000/api',
  );
}
