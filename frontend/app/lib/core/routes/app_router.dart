import 'package:flutter/widgets.dart';

import '../../shared/layouts/main_navigation_shell.dart';

class AppRouter {
  const AppRouter._();

  static Widget buildHome() {
    return const MainNavigationShell();
  }
}
