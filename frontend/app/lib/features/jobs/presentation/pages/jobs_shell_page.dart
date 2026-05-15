import 'package:flutter/material.dart';

import '../../../roadmap/presentation/pages/roadmap_shell_page.dart';

class JobsShellPage extends StatelessWidget {
  const JobsShellPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShellPlaceholderPage(
      title: 'Cơ hội nghề nghiệp',
      description: 'Khung tìm việc theo khu vực sẽ dùng dữ liệu thật từ JobPostings và JobSkills.',
      icon: Icons.work,
    );
  }
}
