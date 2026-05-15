import 'package:flutter/material.dart';

import 'core/routes/app_router.dart';
import 'core/theme/app_theme.dart';

void main() {
  runApp(const EduAiApp());
}

class EduAiApp extends StatelessWidget {
  const EduAiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduAI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: AppRouter.buildHome(),
    );
  }
}
