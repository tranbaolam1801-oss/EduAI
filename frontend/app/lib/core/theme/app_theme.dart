import 'package:flutter/material.dart';

class AppTheme {
  const AppTheme._();

  static ThemeData get darkTheme {
    const surface = Color(0xFF0B1220);
    const surfaceSoft = Color(0xFF121D33);
    const primary = Color(0xFF7560FF);
    const accent = Color(0xFF3ABEFF);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: primary,
      brightness: Brightness.dark,
    ).copyWith(
      primary: primary,
      secondary: accent,
      surface: surface,
    );

    return ThemeData(
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFF07101D),
      useMaterial3: true,
      textTheme: ThemeData.dark().textTheme.apply(
            bodyColor: const Color(0xFFEAF1FF),
            displayColor: const Color(0xFFEAF1FF),
          ),
      cardTheme: const CardThemeData(
        color: surfaceSoft,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(24)),
        ),
      ),
      navigationBarTheme: const NavigationBarThemeData(
        backgroundColor: surface,
        indicatorColor: Color(0x337560FF),
      ),
    );
  }
}
