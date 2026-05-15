import 'package:flutter/material.dart';

import '../../../roadmap/presentation/pages/roadmap_shell_page.dart';

class ProfileShellPage extends StatelessWidget {
  const ProfileShellPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShellPlaceholderPage(
      title: 'Hồ sơ học tập',
      description: 'Onboarding và thông tin cá nhân sẽ được triển khai sau khi xong nền auth và profile.',
      icon: Icons.person,
    );
  }
}
