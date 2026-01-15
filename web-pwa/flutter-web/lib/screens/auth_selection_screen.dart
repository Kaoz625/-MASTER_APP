import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class AuthSelectionScreen extends StatelessWidget {
  const AuthSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/age-selection')),
        title: const Text('Sign In'), backgroundColor: Colors.white, elevation: 0,
      ),
      body: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Choose how you would like to sign in',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.grey[800]),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              AuthOptionButton(
                icon: FontAwesomeIcons.google, label: 'Continue with Google',
                onTap: () => _signInWithGoogle(context), color: Colors.white, iconColor: Colors.blue.shade700,
              ),
              const SizedBox(height: 16),
              AuthOptionButton(
                icon: FontAwesomeIcons.apple, label: 'Continue with Apple',
                onTap: () => _signInWithApple(context), color: Colors.black, iconColor: Colors.white,
              ),
              const SizedBox(height: 16),
              AuthOptionButton(
                icon: FontAwesomeIcons.envelope, label: 'Continue with Email',
                onTap: () => _signInWithEmail(context), color: Colors.white, iconColor: Colors.blue.shade600,
              ),
              const SizedBox(height: 16),
              AuthOptionButton(
                icon: FontAwesomeIcons.phone, label: 'Continue with Phone',
                onTap: () => _signInWithPhone(context), color: Colors.white, iconColor: Colors.green.shade600,
              ),
              const SizedBox(height: 32),
              Center(
                child: TextButton(
                  onPressed: () {},
                  child: Text('Forgot password?', style: TextStyle(fontSize: 16, color: Colors.grey[700], decoration: TextDecoration.underline)),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  Provider.of<AuthProvider>(context, listen: false).login('demo-user-123', 'demo@example.com', 'adult', admin: true);
                  context.go('/main');
                },
                child: const Text('Demo Login (Test App)', style: TextStyle(fontSize: 14, color: Colors.blue)),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  void _signInWithGoogle(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Google sign in - Demo mode')));
    Provider.of<AuthProvider>(context, listen: false).login('google-user-123', 'user@gmail.com', 'adult');
    context.go('/main');
  }
  
  void _signInWithApple(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Apple sign in - Demo mode')));
    Provider.of<AuthProvider>(context, listen: false).login('apple-user-123', 'user@icloud.com', 'adult');
    context.go('/main');
  }
  
  void _signInWithEmail(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Email sign in - Demo mode')));
    Provider.of<AuthProvider>(context, listen: false).login('email-user-123', 'user@example.com', 'adult');
    context.go('/main');
  }
  
  void _signInWithPhone(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Phone sign in - Demo mode')));
    Provider.of<AuthProvider>(context, listen: false).login('phone-user-123', '+1234567890', 'adult');
    context.go('/main');
  }
}

class AuthOptionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;
  final Color iconColor;

  const AuthOptionButton({
    super.key, required this.icon, required this.label, required this.onTap,
    required this.color, required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: color, borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap, borderRadius: BorderRadius.circular(12),
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 24, color: iconColor),
                const SizedBox(width: 16),
                Text(label,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: iconColor == Colors.white ? Colors.white : Colors.black87),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
