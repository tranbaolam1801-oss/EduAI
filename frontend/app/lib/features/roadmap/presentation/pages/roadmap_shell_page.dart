import 'package:flutter/material.dart';

import '../../../../../core/constants/app_constants.dart';

class RoadmapShellPage extends StatelessWidget {
  const RoadmapShellPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShellPlaceholderPage(
      title: 'Lộ trình học tập',
      description: 'Khung mobile cho roadmap sẽ hiển thị stage, task và tiến độ ở phase sau.',
      icon: Icons.route,
    );
  }
}

class ShellPlaceholderPage extends StatelessWidget {
  const ShellPlaceholderPage({
    required this.title,
    required this.description,
    required this.icon,
  });

  final String title;
  final String description;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Card(
          margin: const EdgeInsets.all(AppConstants.shellPadding),
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.shellPadding),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 42),
                const SizedBox(height: 12),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white70,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
