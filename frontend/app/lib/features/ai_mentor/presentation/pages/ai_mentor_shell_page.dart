import 'package:flutter/material.dart';

import '../../../../data/services/backend_api_service.dart';
import '../../../../shared/state/session_controller.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/page_layout.dart';

class AiMentorShellPage extends StatefulWidget {
  const AiMentorShellPage({super.key});

  @override
  State<AiMentorShellPage> createState() => _AiMentorShellPageState();
}

class _AiMentorShellPageState extends State<AiMentorShellPage> {
  final TextEditingController _messageController = TextEditingController();

  late Future<_ChatData> _future;
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<_ChatData> _load() async {
    final token = SessionController.instance.accessToken!;
    final api = BackendApiService.instance;
    var sessions = await api.getChatSessions(token);

    if (sessions.isEmpty) {
      await api.createChatSession(token, title: 'Trao đổi học tập');
      sessions = await api.getChatSessions(token);
    }

    final selectedSession = sessions.first;
    final sessionId = (selectedSession['session_id'] as num).toInt();
    final detail = await api.getChatSessionDetail(token, sessionId);

    return _ChatData(
      sessions: sessions,
      selectedSession: selectedSession,
      detail: detail,
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  Future<void> _sendMessage() async {
    final message = _messageController.text.trim();
    if (message.isEmpty || _isSending) {
      return;
    }

    final snapshot = await _future;
    final sessionId = (snapshot.selectedSession['session_id'] as num).toInt();

    setState(() {
      _isSending = true;
    });

    try {
      await BackendApiService.instance.sendChatMessage(
        SessionController.instance.accessToken!,
        sessionId,
        messageContent: message,
      );
      _messageController.clear();
      await _refresh();
    } finally {
      if (mounted) {
        setState(() {
          _isSending = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_ChatData>(
      future: _future,
      builder: (context, snapshot) {
        final isLoading = snapshot.connectionState != ConnectionState.done;
        final error = snapshot.error;
        final data = snapshot.data;
        final messages = (data?.detail['messages'] as List<dynamic>? ?? const []);

        return PageLayout(
          title: 'AI Mentor',
          subtitle: 'Trao đổi học tập trên mobile qua backend /chat, không nhân bản logic AI trong ứng dụng Flutter.',
          onRefresh: _refresh,
          children: [
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (error != null)
              GlassCard(child: Text(error.toString()))
            else ...[
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data?.selectedSession['title']?.toString() ?? 'Phiên AI Mentor',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 12),
                    if (messages.isEmpty)
                      const Text('Chưa có tin nhắn nào trong phiên học tập này.')
                    else
                      ...messages.map(
                        (message) => Align(
                          alignment: message['sender_type'] == 'USER'
                              ? Alignment.centerRight
                              : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(18),
                              color: message['sender_type'] == 'USER'
                                  ? const Color(0xFF5B4BFF)
                                  : const Color(0xFF111C31),
                            ),
                            child: Text(message['message_content']?.toString() ?? ''),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: _messageController,
                      maxLines: 3,
                      minLines: 1,
                      decoration: const InputDecoration(
                        labelText: 'Tin nhắn cho AI Mentor',
                        hintText: 'Ví dụ: Mình nên học SQL trước hay Power BI trước?',
                      ),
                    ),
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        onPressed: _isSending ? null : _sendMessage,
                        icon: const Icon(Icons.send_outlined),
                        label: Text(_isSending ? 'Đang gửi...' : 'Gửi cho AI Mentor'),
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

class _ChatData {
  const _ChatData({
    required this.sessions,
    required this.selectedSession,
    required this.detail,
  });

  final List<Map<String, dynamic>> sessions;
  final Map<String, dynamic> selectedSession;
  final Map<String, dynamic> detail;
}
