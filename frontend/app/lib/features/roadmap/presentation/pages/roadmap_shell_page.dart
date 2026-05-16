import 'package:flutter/material.dart';

import '../../../../core/utils/label_utils.dart';
import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/page_layout.dart';

class RoadmapShellPage extends StatefulWidget {
  const RoadmapShellPage({super.key});

  @override
  State<RoadmapShellPage> createState() => _RoadmapShellPageState();
}

class _RoadmapShellPageState extends State<RoadmapShellPage> {
  late Future<_RoadmapData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_RoadmapData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;
    final roadmaps = await api.getMyRoadmaps(token);
    final progress = await api.getAnalyticsRoadmapProgress(token);
    final firstRoadmap = roadmaps.isNotEmpty ? roadmaps.first : null;
    final stages = firstRoadmap == null
        ? const <Map<String, dynamic>>[]
        : await api.getRoadmapStages(token, (firstRoadmap['roadmap_id'] as num).toInt());

    return _RoadmapData(
      roadmaps: roadmaps,
      stages: stages,
      progress: progress,
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
    return FutureBuilder<_RoadmapData>(
      future: _future,
      builder: (context, snapshot) {
        final isLoading = snapshot.connectionState != ConnectionState.done;
        final error = snapshot.error;
        final data = snapshot.data;

        return PageLayout(
          title: 'Lộ trình học',
          subtitle: 'Roadmap mobile lấy trực tiếp từ LearningRoadmaps, RoadmapStages và RoadmapTasks qua backend.',
          onRefresh: _refresh,
          children: [
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (error != null)
              GlassCard(child: Text(error.toString()))
            else if (data == null || data.roadmaps.isEmpty)
              const GlassCard(
                child: Text('Chưa có lộ trình học nào để hiển thị trên mobile.'),
              )
            else ...[
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.roadmaps.first['title']?.toString() ?? 'Lộ trình hiện tại',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Tiến độ ${(data.roadmaps.first['progress_percent'] ?? 0).round()}% • ${data.progress['summary']?['completed_tasks'] ?? 0}/${data.progress['summary']?['total_tasks'] ?? 0} nhiệm vụ',
                    ),
                  ],
                ),
              ),
              ...data.stages.map(
                (stage) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          stage['stage_name']?.toString() ?? 'Giai đoạn',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w700,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          stage['description']?.toString() ?? 'Không có mô tả.',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Colors.white70,
                              ),
                        ),
                        const SizedBox(height: 14),
                        ...((stage['tasks'] as List<dynamic>? ?? const [])
                            .map(
                              (task) => Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(
                                      (task['status'] == 'COMPLETED')
                                          ? Icons.check_circle
                                          : (task['status'] == 'IN_PROGRESS')
                                              ? Icons.timelapse
                                              : Icons.radio_button_unchecked,
                                      size: 20,
                                      color: (task['status'] == 'COMPLETED')
                                          ? Colors.greenAccent
                                          : Theme.of(context).colorScheme.secondary,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(task['task_title']?.toString() ?? 'Nhiệm vụ'),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${getTaskTypeLabel(task['task_type']?.toString())} • ${getTaskStatusLabel(task['status']?.toString())} • ${task['latest_progress_percent'] ?? 0}%',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                                  color: Colors.white60,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                            .toList()),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ],
        );
      },
    );
  }
}

class _RoadmapData {
  const _RoadmapData({
    required this.roadmaps,
    required this.stages,
    required this.progress,
  });

  final List<Map<String, dynamic>> roadmaps;
  final List<Map<String, dynamic>> stages;
  final Map<String, dynamic> progress;
}
