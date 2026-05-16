class AppConfig {
  const AppConfig._();

  static const String appName = 'EduAI';
  static const String backendBaseUrl = String.fromEnvironment(
    'BACKEND_API_URL',
    defaultValue: 'http://localhost:3000/api/v1',
  );
  static const String aiServiceBaseUrl = String.fromEnvironment(
    'AI_SERVICE_URL',
    defaultValue: 'http://localhost:8000',
  );
}
