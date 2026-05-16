import 'package:flutter/material.dart';

import '../../core/constants/app_constants.dart';
import 'glass_card.dart';

class PageLayout extends StatelessWidget {
  const PageLayout({
    super.key,
    required this.title,
    required this.subtitle,
    required this.children,
    this.onRefresh,
    this.trailing,
  });

  final String title;
  final String subtitle;
  final List<Widget> children;
  final Future<void> Function()? onRefresh;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final listView = ListView(
      padding: const EdgeInsets.all(AppConstants.shellPadding),
      children: [
        GlassCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          subtitle,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Colors.white70,
                                height: 1.45,
                              ),
                        ),
                      ],
                    ),
                  ),
                  if (trailing != null) ...[
                    const SizedBox(width: 12),
                    trailing!,
                  ],
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: AppConstants.sectionSpacing),
        ...children.expand(
          (widget) => [
            widget,
            const SizedBox(height: AppConstants.sectionSpacing),
          ],
        ),
      ],
    );

    return SafeArea(
      child: onRefresh == null
          ? listView
          : RefreshIndicator(
              onRefresh: onRefresh!,
              child: listView,
            ),
    );
  }
}
