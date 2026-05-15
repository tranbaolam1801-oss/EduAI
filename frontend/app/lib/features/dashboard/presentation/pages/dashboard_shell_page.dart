import 'package:flutter/material.dart';

import '../../../../../core/constants/app_constants.dart';

class DashboardShellPage extends StatelessWidget {
  const DashboardShellPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(AppConstants.shellPadding),
        children: const [
          _Headline(
            title: 'Tổng quan học tập',
            subtitle: 'Khung giao diện mobile cho dashboard đang sẵn sàng kết nối API.',
          ),
          SizedBox(height: 16),
          _FeatureCard(
            title: 'Bố cục Phase 1',
            description: 'Trang chủ, lộ trình, AI mentor, việc làm và hồ sơ đã có shell điều hướng.',
          ),
          SizedBox(height: 16),
          _StatusCard(
            label: 'Backend',
            value: 'http://localhost:3000/api/v1',
          ),
          SizedBox(height: 12),
          _StatusCard(
            label: 'AI Service',
            value: 'http://localhost:8000/api/v1',
          ),
        ],
      ),
    );
  }
}

class _Headline extends StatelessWidget {
  const _Headline({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white70,
              ),
        ),
      ],
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({required this.title, required this.description});

  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.shellPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 10),
            Text(
              description,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.white70,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(label),
        subtitle: Text(value),
        trailing: const Icon(Icons.arrow_forward_ios, size: 18),
      ),
    );
  }
}
