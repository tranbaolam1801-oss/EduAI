import 'package:flutter/material.dart';

import '../../../../core/utils/label_utils.dart';
import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/module_screen.dart';

class ResourcesPage extends StatefulWidget {
  const ResourcesPage({super.key});

  @override
  State<ResourcesPage> createState() => _ResourcesPageState();
}

class _ResourcesPageState extends State<ResourcesPage> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<Map<String, dynamic>>> _load() {
    return BackendApiService.instance.getResources(
      SessionController.instance.accessToken!,
      query: {'limit': 12},
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
      title: 'Tài liệu',
      subtitle: 'Tài liệu học tập lấy trực tiếp từ backend, không nhân bản logic gợi ý trên mobile.',
      onRefresh: _refresh,
      child: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return GlassCard(
              child: Text(snapshot.error.toString()),
            );
          }

          final items = snapshot.data ?? const <Map<String, dynamic>>[];

          if (items.isEmpty) {
            return const GlassCard(
              child: Text('Chưa có tài liệu phù hợp để hiển thị.'),
            );
          }

          return Column(
            children: items
                .map(
                  (resource) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(resource['title']?.toString() ?? 'Tài liệu'),
                        subtitle: Text(
                          '${resource['provider'] ?? 'Nhà cung cấp'} • ${getDifficultyLabel(resource['difficulty_level']?.toString())}',
                        ),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '${resource['rating'] ?? 0}/5',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w700,
                                  ),
                            ),
                            Text(
                              getResourceTypeLabel(resource['resource_type']?.toString()),
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Colors.white60,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                )
                .toList(),
          );
        },
      ),
    );
  }
}
