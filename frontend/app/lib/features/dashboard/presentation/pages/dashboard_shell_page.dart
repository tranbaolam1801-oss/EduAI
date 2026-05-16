import 'package:flutter/material.dart';

import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/metric_card.dart';
import '../../../../shared/widgets/page_layout.dart';
import '../../../quiz/presentation/pages/quiz_page.dart';
import '../../../resources/presentation/pages/resources_page.dart';
import '../../../skills/presentation/pages/skills_page.dart';

class DashboardShellPage extends StatefulWidget {
  const DashboardShellPage({super.key});

  @override
  State<DashboardShellPage> createState() => _DashboardShellPageState();
}

class _DashboardShellPageState extends State<DashboardShellPage> {
  late Future<_DashboardData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_DashboardData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;
    final analytics = await api.getAnalyticsDashboard(token);
    final notifications = await api.getNotifications(token, limit: 5);
    return _DashboardData(
      analytics: analytics,
      notifications: notifications,
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  void _openModule(BuildContext context, Widget page) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => page),
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_DashboardData>(
      future: _future,
      builder: (context, snapshot) {
        final isLoading = snapshot.connectionState != ConnectionState.done;
        final error = snapshot.error;
        final data = snapshot.data;
        final userName = SessionController.instance.currentUser?['full_name']?.toString() ?? 'Bạn';

        return PageLayout(
          title: 'Tổng quan học tập',
          subtitle: 'Xin chào $userName. Mobile app đọc trực tiếp analytics, notifications và roadmap từ backend hiện tại.',
          onRefresh: _refresh,
          children: [
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (error != null)
              GlassCard(child: Text(error.toString()))
            else ...[
              _MetricGrid(
                metrics: [
                  MetricCard(
                    label: 'Tiến độ lộ trình',
                    value: '${(data!.analytics['overview']?['current_roadmap_progress'] ?? 0).round()}%',
                    helper: '${data.analytics['overview']?['completed_tasks'] ?? 0}/${data.analytics['overview']?['total_tasks'] ?? 0} nhiệm vụ',
                    icon: Icons.route_outlined,
                  ),
                  MetricCard(
                    label: 'Kỹ năng đã lưu',
                    value: '${data.analytics['overview']?['assessed_skills_count'] ?? 0}',
                    helper: 'Mức TB ${(data.analytics['overview']?['average_skill_level'] ?? 0).round()}%',
                    icon: Icons.stars_outlined,
                  ),
                  MetricCard(
                    label: 'Thông báo mới',
                    value: '${data.analytics['overview']?['unread_notifications'] ?? 0}',
                    helper: '${data.analytics['overview']?['joined_challenges_count'] ?? 0} challenge đã tham gia',
                    icon: Icons.notifications_active_outlined,
                  ),
                ],
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
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        FilledButton.tonalIcon(
                          onPressed: () => _openModule(context, const SkillsPage()),
                          icon: const Icon(Icons.auto_graph_outlined),
                          label: const Text('Kỹ năng'),
                        ),
                        FilledButton.tonalIcon(
                          onPressed: () => _openModule(context, const ResourcesPage()),
                          icon: const Icon(Icons.menu_book_outlined),
                          label: const Text('Tài liệu'),
                        ),
                        FilledButton.tonalIcon(
                          onPressed: () => _openModule(context, const QuizPage()),
                          icon: const Icon(Icons.quiz_outlined),
                          label: const Text('Bài kiểm tra'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bước học tiếp theo',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      data.analytics['focus']?['next_step']?.toString() ??
                          data.analytics['notice']?.toString() ??
                          'Hãy bắt đầu từ việc cập nhật kỹ năng hoặc tạo roadmap.',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.45),
                    ),
                  ],
                ),
              ),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Thông báo gần đây',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 12),
                    if (data.notifications.isEmpty)
                      const Text('Chưa có thông báo mới.')
                    else
                      ...data.notifications.map(
                        (notification) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Text(
                            '• ${notification['title']}',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ],
        );
      },
    );
  }
}

class _DashboardData {
  const _DashboardData({
    required this.analytics,
    required this.notifications,
  });

  final Map<String, dynamic> analytics;
  final List<Map<String, dynamic>> notifications;
}

class _MetricGrid extends StatelessWidget {
  const _MetricGrid({required this.metrics});

  final List<Widget> metrics;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth >= 700 ? 3 : 1;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          childAspectRatio: crossAxisCount == 1 ? 2.5 : 1.35,
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: metrics,
        );
      },
    );
  }
}
