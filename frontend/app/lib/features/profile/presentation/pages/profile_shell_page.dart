import 'package:flutter/material.dart';

import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/page_layout.dart';
import '../../../quiz/presentation/pages/quiz_page.dart';
import '../../../resources/presentation/pages/resources_page.dart';
import '../../../skills/presentation/pages/skills_page.dart';

class ProfileShellPage extends StatelessWidget {
  const ProfileShellPage({super.key});

  void _openPage(BuildContext context, Widget page) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => page),
    );
  }

  @override
  Widget build(BuildContext context) {
    final session = SessionController.instance;
    final user = session.currentUser ?? const <String, dynamic>{};
    final profile = session.profile ?? const <String, dynamic>{};

    return PageLayout(
      title: 'Hồ sơ',
      subtitle: 'Thông tin cá nhân, hồ sơ học tập và các lối tắt mobile đều lấy dữ liệu từ backend hiện có.',
      children: [
        GlassCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                user['full_name']?.toString() ?? 'Sinh viên',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 8),
              Text(user['email']?.toString() ?? 'Chưa có email'),
              const SizedBox(height: 12),
              Text('Ngành: ${profile['major'] ?? 'Chưa cập nhật'}'),
              Text('Trường: ${profile['university'] ?? 'Chưa cập nhật'}'),
              Text('Địa điểm ưu tiên: ${profile['preferred_location'] ?? 'Chưa cập nhật'}'),
            ],
          ),
        ),
        GlassCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Lối tắt học tập',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  FilledButton.tonal(
                    onPressed: () => _openPage(context, const SkillsPage()),
                    child: const Text('Kỹ năng'),
                  ),
                  FilledButton.tonal(
                    onPressed: () => _openPage(context, const ResourcesPage()),
                    child: const Text('Tài liệu'),
                  ),
                  FilledButton.tonal(
                    onPressed: () => _openPage(context, const QuizPage()),
                    child: const Text('Bài kiểm tra'),
                  ),
                ],
              ),
            ],
          ),
        ),
        GlassCard(
          child: SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: session.logout,
              icon: const Icon(Icons.logout),
              label: const Text('Đăng xuất'),
            ),
          ),
        ),
      ],
    );
  }
}
