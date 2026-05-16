import 'package:flutter/material.dart';

import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/metric_card.dart';
import '../../../../shared/widgets/page_layout.dart';
import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';

class ReportsShellPage extends StatefulWidget {
  const ReportsShellPage({super.key});

  @override
  State<ReportsShellPage> createState() => _ReportsShellPageState();
}

class _ReportsShellPageState extends State<ReportsShellPage> {
  late Future<_ReportsData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_ReportsData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;
    final learningSummary = await api.getLearningSummaryReport(token);
    final careerReadiness = await api.getCareerReadinessReport(token);
    return _ReportsData(
      learningSummary: learningSummary,
      careerReadiness: careerReadiness,
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_ReportsData>(
      future: _future,
      builder: (context, snapshot) {
        final isLoading = snapshot.connectionState != ConnectionState.done;
        final error = snapshot.error;
        final data = snapshot.data;

        return PageLayout(
          title: 'Báo cáo',
          subtitle: 'Báo cáo học tập trên mobile vẫn ưu tiên tiến độ học, quiz và mức sẵn sàng nghề nghiệp ở mức tham chiếu.',
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
                    label: 'Tiến độ roadmap',
                    value: '${(data!.learningSummary['overview']?['current_roadmap_progress'] ?? 0).round()}%',
                    helper: data.learningSummary['current_roadmap']?['title']?.toString() ?? 'Chưa có roadmap',
                    icon: Icons.route_outlined,
                  ),
                  MetricCard(
                    label: 'Điểm quiz TB',
                    value: '${(data.learningSummary['quiz_results']?['summary']?['average_score'] ?? 0).round()}',
                    helper: '${data.learningSummary['quiz_results']?['summary']?['attempts_count'] ?? 0} lượt đã chấm',
                    icon: Icons.quiz_outlined,
                  ),
                  MetricCard(
                    label: 'Sẵn sàng nghề',
                    value: data.careerReadiness['readiness'] == null
                        ? 'Chưa có'
                        : '${(data.careerReadiness['readiness']?['readiness_percent'] ?? 0).round()}%',
                    helper: data.careerReadiness['career_goal']?['career_name']?.toString() ?? 'Chưa chọn mục tiêu',
                    icon: Icons.workspace_premium_outlined,
                  ),
                ],
              ),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Tóm tắt học tập',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      data.learningSummary['focus']?['next_step']?.toString() ??
                          data.learningSummary['notice']?.toString() ??
                          'Tiếp tục cập nhật tiến độ học tập để hệ thống theo dõi sát hơn.',
                    ),
                  ],
                ),
              ),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Khoảng cách ưu tiên',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 12),
                    ...((data.careerReadiness['priority_gaps'] as List<dynamic>? ?? const [])
                        .take(4)
                        .map(
                          (gap) => Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Text(
                              '${gap['skill_name']} • Gap ${gap['gap_level']}% • Mục tiêu ${gap['required_level']}%',
                            ),
                          ),
                        )),
                    if ((data.careerReadiness['priority_gaps'] as List<dynamic>? ?? const []).isEmpty)
                      const Text('Chưa có dữ liệu gap ưu tiên cho nghề mục tiêu hiện tại.'),
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

class _ReportsData {
  const _ReportsData({
    required this.learningSummary,
    required this.careerReadiness,
  });

  final Map<String, dynamic> learningSummary;
  final Map<String, dynamic> careerReadiness;
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
          childAspectRatio: crossAxisCount == 1 ? 2.4 : 1.3,
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
