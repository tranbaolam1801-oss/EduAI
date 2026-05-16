import 'dart:convert';
import 'dart:io';

import '../../core/config/app_config.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode, this.code, this.details = const []});

  final String message;
  final int? statusCode;
  final String? code;
  final List<dynamic> details;

  @override
  String toString() => message;
}

class BackendApiService {
  BackendApiService._();

  static final BackendApiService instance = BackendApiService._();

  final HttpClient _client = HttpClient();

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final data = await _request(
      '/auth/login',
      method: 'POST',
      body: {
        'email': email,
        'password': password,
      },
    );

    return _asMap(data);
  }

  Future<Map<String, dynamic>> getMe(String token) async {
    final data = await _request('/users/me', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>?> getMyProfile(String token) async {
    try {
      final data = await _request('/profiles/me', token: token);
      return _asMap(data);
    } on ApiException catch (error) {
      if (error.statusCode == 404) {
        return null;
      }
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getMyUserSkills(String token) async {
    final data = await _request('/user-skills/me', token: token);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getResources(
    String token, {
    Map<String, dynamic>? query,
  }) async {
    final data = await _request('/resources', token: token, query: query);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getRecommendedResources(
    String token, {
    Map<String, dynamic>? query,
  }) async {
    final data = await _request('/resources/recommend', token: token, query: query);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getQuizzes(String token) async {
    final data = await _request('/quizzes', token: token);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getQuizAttempts(String token) async {
    final data = await _request('/quiz-attempts/me', token: token);
    return _asListOfMap(data);
  }

  Future<Map<String, dynamic>> getAnalyticsDashboard(String token) async {
    final data = await _request('/analytics/dashboard', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>> getAnalyticsSkillGap(String token) async {
    final data = await _request('/analytics/skill-gap', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>> getAnalyticsRoadmapProgress(String token) async {
    final data = await _request('/analytics/roadmap-progress', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>> getAnalyticsQuizResults(String token) async {
    final data = await _request('/analytics/quiz-results', token: token);
    return _asMap(data);
  }

  Future<List<Map<String, dynamic>>> getMyRoadmaps(String token) async {
    final data = await _request('/roadmaps/me', token: token);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getRoadmapStages(String token, int roadmapId) async {
    final data = await _request('/roadmaps/$roadmapId/stages', token: token);
    return _asListOfMap(data);
  }

  Future<List<Map<String, dynamic>>> getChatSessions(String token) async {
    final data = await _request('/chat/sessions', token: token);
    return _asListOfMap(data);
  }

  Future<Map<String, dynamic>> createChatSession(
    String token, {
    String? title,
  }) async {
    final data = await _request(
      '/chat/sessions',
      method: 'POST',
      token: token,
      body: {
        if (title != null && title.trim().isNotEmpty) 'title': title.trim(),
      },
    );

    return _asMap(data);
  }

  Future<Map<String, dynamic>> getChatSessionDetail(String token, int sessionId) async {
    final data = await _request('/chat/sessions/$sessionId', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>> sendChatMessage(
    String token,
    int sessionId, {
    required String messageContent,
  }) async {
    final data = await _request(
      '/chat/sessions/$sessionId/messages',
      method: 'POST',
      token: token,
      body: {
        'message_content': messageContent,
      },
    );

    return _asMap(data);
  }

  Future<Map<String, dynamic>> getLearningSummaryReport(String token) async {
    final data = await _request('/reports/learning-summary', token: token);
    return _asMap(data);
  }

  Future<Map<String, dynamic>> getCareerReadinessReport(String token) async {
    final data = await _request('/reports/career-readiness', token: token);
    return _asMap(data);
  }

  Future<List<Map<String, dynamic>>> getNotifications(
    String token, {
    int limit = 10,
  }) async {
    final data = await _request(
      '/notifications/me',
      token: token,
      query: {'limit': limit},
    );
    return _asListOfMap(data);
  }

  Future<dynamic> _request(
    String path, {
    String method = 'GET',
    String? token,
    Map<String, dynamic>? query,
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('${AppConfig.backendBaseUrl}$path').replace(
      queryParameters: query?.map(
        (key, value) => MapEntry(key, value?.toString()),
      ),
    );

    final request = await _client.openUrl(method, uri);
    request.headers.contentType = ContentType.json;

    if (token != null && token.isNotEmpty) {
      request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
    }

    if (body != null) {
      request.write(jsonEncode(body));
    }

    final response = await request.close();
    final responseText = await response.transform(utf8.decoder).join();
    final payload = responseText.isEmpty ? <String, dynamic>{} : jsonDecode(responseText);

    if (response.statusCode >= 400) {
      throw ApiException(
        payload is Map<String, dynamic>
            ? (payload['error']?['message'] as String? ?? 'Yêu cầu thất bại.')
            : 'Yêu cầu thất bại.',
        statusCode: response.statusCode,
        code: payload is Map<String, dynamic> ? payload['error']?['code'] as String? : null,
        details: payload is Map<String, dynamic>
            ? (payload['error']?['details'] as List<dynamic>? ?? const [])
            : const [],
      );
    }

    if (payload is Map<String, dynamic>) {
      return payload['data'];
    }

    return payload;
  }

  Map<String, dynamic> _asMap(dynamic value) {
    if (value is Map<String, dynamic>) {
      return value;
    }

    if (value is Map) {
      return value.map((key, innerValue) => MapEntry('$key', innerValue));
    }

    return <String, dynamic>{};
  }

  List<Map<String, dynamic>> _asListOfMap(dynamic value) {
    if (value is List) {
      return value
          .map(
            (item) => item is Map<String, dynamic>
                ? item
                : (item is Map ? item.map((key, innerValue) => MapEntry('$key', innerValue)) : <String, dynamic>{}),
          )
          .toList();
    }

    return const <Map<String, dynamic>>[];
  }
}
