import 'package:flutter/foundation.dart';

import '../../data/services/backend_api_service.dart';

class SessionController extends ChangeNotifier {
  SessionController._();

  static final SessionController instance = SessionController._();

  final BackendApiService _apiService = BackendApiService.instance;

  String? _accessToken;
  Map<String, dynamic>? _currentUser;
  Map<String, dynamic>? _profile;
  bool _isAuthenticating = false;

  String? get accessToken => _accessToken;
  Map<String, dynamic>? get currentUser => _currentUser;
  Map<String, dynamic>? get profile => _profile;
  bool get isAuthenticating => _isAuthenticating;
  bool get isAuthenticated => _accessToken != null && _currentUser != null;

  Future<void> login({
    required String email,
    required String password,
  }) async {
    _isAuthenticating = true;
    notifyListeners();

    try {
      final payload = await _apiService.login(email: email, password: password);
      _accessToken = payload['access_token'] as String?;
      _currentUser = payload['user'] as Map<String, dynamic>?;

      if (_accessToken == null || _currentUser == null) {
        throw ApiException('Phiên đăng nhập không hợp lệ.');
      }

      await refreshProfile();
    } finally {
      _isAuthenticating = false;
      notifyListeners();
    }
  }

  Future<void> refreshProfile() async {
    if (_accessToken == null) {
      return;
    }

    _currentUser = await _apiService.getMe(_accessToken!);
    _profile = await _apiService.getMyProfile(_accessToken!);
    notifyListeners();
  }

  void logout() {
    _accessToken = null;
    _currentUser = null;
    _profile = null;
    notifyListeners();
  }
}
