import 'package:flutter/material.dart';

import '../../../../../shared/state/session_controller.dart';
import '../../../../../shared/widgets/glass_card.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _errorMessage = null;
    });

    try {
      await SessionController.instance.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
    } catch (error) {
      setState(() {
        _errorMessage = error.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF050816),
              Color(0xFF0B1330),
              Color(0xFF1B1B57),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: GlassCard(
                  padding: const EdgeInsets.all(24),
                  child: Form(
                    key: _formKey,
                    child: AnimatedBuilder(
                      animation: SessionController.instance,
                      builder: (context, _) {
                        final isLoading = SessionController.instance.isAuthenticating;

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Đăng nhập',
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                    fontWeight: FontWeight.w800,
                                  ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Đăng nhập để theo dõi lộ trình học, kỹ năng, quiz, AI Mentor và báo cáo học tập trên mobile.',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Colors.white70,
                                    height: 1.5,
                                  ),
                            ),
                            const SizedBox(height: 24),
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Email',
                                hintText: 'student@example.com',
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Vui lòng nhập email.';
                                }
                                if (!value.contains('@')) {
                                  return 'Email không hợp lệ.';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: const InputDecoration(
                                labelText: 'Mật khẩu',
                                hintText: 'Nhập mật khẩu',
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Vui lòng nhập mật khẩu.';
                                }
                                if (value.length < 6) {
                                  return 'Mật khẩu phải có ít nhất 6 ký tự.';
                                }
                                return null;
                              },
                            ),
                            if (_errorMessage != null) ...[
                              const SizedBox(height: 16),
                              Text(
                                _errorMessage!,
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Colors.redAccent.shade100,
                                    ),
                              ),
                            ],
                            const SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: FilledButton(
                                onPressed: isLoading ? null : _submit,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  child: Text(isLoading ? 'Đang đăng nhập...' : 'Vào hệ thống'),
                                ),
                              ),
                            ),
                            const SizedBox(height: 18),
                            Text(
                              'API backend: http://localhost:3000/api/v1',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Colors.white54,
                                  ),
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
