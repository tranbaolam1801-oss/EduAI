import 'package:flutter/material.dart';

import '../../core/constants/app_constants.dart';
import 'page_layout.dart';

class ModuleScreen extends StatelessWidget {
  const ModuleScreen({
    super.key,
    required this.title,
    required this.subtitle,
    required this.child,
    this.onRefresh,
    this.trailing,
  });

  final String title;
  final String subtitle;
  final Widget child;
  final Future<void> Function()? onRefresh;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: PageLayout(
        title: title,
        subtitle: subtitle,
        onRefresh: onRefresh,
        trailing: trailing,
        children: [
          child,
          const SizedBox(height: AppConstants.shellPadding),
        ],
      ),
    );
  }
}
