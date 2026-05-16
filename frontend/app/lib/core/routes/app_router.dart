import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../shared/layouts/main_navigation_shell.dart';
import '../../shared/state/session_controller.dart';

class AppRouter {
  const AppRouter._();

  static Widget buildHome() {
    return AnimatedBuilder(
      animation: SessionController.instance,
      builder: (context, _) {
        if (SessionController.instance.isAuthenticated) {
          return const MainNavigationShell();
        }

        return const LoginPage();
      },
    );
  }
}
