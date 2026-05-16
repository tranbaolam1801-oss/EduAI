import 'package:flutter/material.dart';

import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/module_screen.dart';

class SkillsPage extends StatefulWidget {
  const SkillsPage({super.key});

  @override
  State<SkillsPage> createState() => _SkillsPageState();
}

class _SkillsPageState extends State<SkillsPage> {
  late Future<_SkillsData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_SkillsData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;
    final userSkills = await api.getMyUserSkills(token);
    final analytics = await api.getAnalyticsSkillGap(token);

    return _SkillsData(
      userSkills: userSkills,
      skillGapSummary: analytics['summary'] as Map<String, dynamic>? ?? const {},
      skillGapItems: (analytics['items'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .toList(),
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
    return ModuleScreen(
      title: 'Kỹ năng',
      subtitle: 'Theo dõi kỹ năng hiện tại và khoảng cách cần bù để phục vụ lộ trình học.',
      onRefresh: _refresh,
      child: FutureBuilder<_SkillsData>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return GlassCard(
              child: Text(
                snapshot.error.toString(),
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            );
          }

          final data = snapshot.data!;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GlassCard(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _SummaryItem(
                      label: 'Kỹ năng đã lưu',
                      value: '${data.userSkills.length}',
                    ),
                    _SummaryItem(
                      label: 'Cần bù gap',
                      value: '${data.skillGapSummary['skills_with_gap'] ?? 0}',
                    ),
                    _SummaryItem(
                      label: 'Gap TB',
                      value: '${(data.skillGapSummary['average_gap'] ?? 0).round()}%',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              ...data.userSkills.map(
                (skill) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          skill['skill_name']?.toString() ?? 'Kỹ năng',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w700,
                              ),
                        ),
                        const SizedBox(height: 10),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(999),
                          child: LinearProgressIndicator(
                            value: ((skill['current_level'] as num?)?.toDouble() ?? 0) / 100,
                            minHeight: 10,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Mức hiện tại ${(skill['current_level'] ?? 0)}% • Độ tự tin ${(skill['confidence_level'] ?? 0)}%',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Colors.white70,
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              if (data.skillGapItems.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  'Khoảng cách ưu tiên',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 12),
                ...data.skillGapItems.take(5).map(
                  (gap) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(gap['skill_name']?.toString() ?? 'Kỹ năng'),
                        subtitle: Text(
                          'Hiện tại ${gap['current_level']}% • Mục tiêu ${gap['required_level']}%',
                        ),
                        trailing: Text(
                          '${gap['gap_level']}%',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                color: Theme.of(context).colorScheme.secondary,
                                fontWeight: FontWeight.w800,
                              ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          );
        },
      ),
    );
  }
}

class _SkillsData {
  const _SkillsData({
    required this.userSkills,
    required this.skillGapSummary,
    required this.skillGapItems,
  });

  final List<Map<String, dynamic>> userSkills;
  final Map<String, dynamic> skillGapSummary;
  final List<Map<String, dynamic>> skillGapItems;
}

class _SummaryItem extends StatelessWidget {
  const _SummaryItem({
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.white70,
                ),
          ),
        ],
      ),
    );
  }
}
