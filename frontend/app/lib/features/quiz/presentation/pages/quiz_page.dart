import 'package:flutter/material.dart';

import '../../../../core/utils/label_utils.dart';
import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/module_screen.dart';

class QuizPage extends StatefulWidget {
  const QuizPage({super.key});

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  late Future<_QuizData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_QuizData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;

    final quizzes = await api.getQuizzes(token);
    final attempts = await api.getQuizAttempts(token);

    return _QuizData(quizzes: quizzes, attempts: attempts);
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
      title: 'Bài kiểm tra',
      subtitle: 'Danh sách quiz và lịch sử làm bài được đọc trực tiếp từ backend /api/v1.',
      onRefresh: _refresh,
      child: FutureBuilder<_QuizData>(
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

          final data = snapshot.data!;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Quiz khả dụng',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 12),
              ...data.quizzes.take(6).map(
                (quiz) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(quiz['quiz_title']?.toString() ?? 'Quiz'),
                        subtitle: Text(
                          '${getDifficultyLabel(quiz['difficulty_level']?.toString())} • ${quiz['passing_score'] ?? 0} điểm đạt',
                        ),
                      ),
                    ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Lịch sử làm bài',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 12),
              if (data.attempts.isEmpty)
                const GlassCard(
                  child: Text('Bạn chưa có lượt làm bài nào trên hệ thống.'),
                )
              else
                ...data.attempts.take(6).map(
                  (attempt) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(attempt['quiz_title']?.toString() ?? 'Quiz'),
                        subtitle: Text(
                          '${getQuizAttemptStatusLabel(attempt['status']?.toString())} • ${attempt['submitted_at'] ?? 'Chưa nộp'}',
                        ),
                        trailing: Text(
                          '${attempt['score'] ?? '-'}',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}

class _QuizData {
  const _QuizData({
    required this.quizzes,
    required this.attempts,
  });

  final List<Map<String, dynamic>> quizzes;
  final List<Map<String, dynamic>> attempts;
}
