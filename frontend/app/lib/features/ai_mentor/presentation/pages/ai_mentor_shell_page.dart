import 'package:flutter/material.dart';

import '../../../roadmap/presentation/pages/roadmap_shell_page.dart';

class AiMentorShellPage extends StatelessWidget {
  const AiMentorShellPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShellPlaceholderPage(
      title: 'AI Mentor',
      description: 'Khung hội thoại mobile đã sẵn sàng, logic AI thật sẽ được bổ sung ở phase sau.',
      icon: Icons.auto_awesome,
    );
  }
}
