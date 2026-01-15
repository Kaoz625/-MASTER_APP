import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFF4A90E2), Color(0xFF357ABD)],
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(color: Colors.black26, blurRadius: 20, offset: Offset(0, 10)),
                        ],
                      ),
                      child: const Icon(FontAwesomeIcons.rocket, size: 64, color: Color(0xFF4A90E2)),
                    ),
                    const SizedBox(height: 40),
                    const Text('Master App',
                      style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 2,
                        shadows: [Shadow(color: Colors.black26, offset: Offset(0, 2), blurRadius: 4)],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text('Universal App Foundation',
                      style: TextStyle(fontSize: 20, color: Colors.white70),
                    ),
                    const SizedBox(height: 16),
                    const Text('Authentication • Payments • Maps • Voice',
                      style: TextStyle(fontSize: 14, color: Colors.white54),
                    ),
                    const SizedBox(height: 64),
                    SizedBox(
                      width: double.infinity,
                      height: 64,
                      child: ElevatedButton(
                        onPressed: () => context.go('/age-selection'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF4A90E2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 8, shadowColor: Colors.black26,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Get Started', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                            const SizedBox(width: 12),
                            const Icon(Icons.arrow_forward, size: 24),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    TextButton(
                      onPressed: () => context.go('/auth-selection'),
                      child: const Text('Already have an account? Login',
                        style: TextStyle(fontSize: 16, color: Colors.white70, decoration: TextDecoration.underline),
                      ),
                    ),
                    const SizedBox(height: 48),
                    Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      _buildFeatureIcon(Icons.security, 'Auth'),
                      const SizedBox(width: 24),
                      _buildFeatureIcon(Icons.map, 'Maps'),
                      const SizedBox(width: 24),
                      _buildFeatureIcon(Icons.mic, 'Voice'),
                      const SizedBox(width: 24),
                      _buildFeatureIcon(Icons.payment, 'Pay'),
                    ]),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureIcon(IconData icon, String label) {
    return Column(children: [
      Container(width: 48, height: 48,
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: Colors.white, size: 24),
      ),
      const SizedBox(height: 4),
      Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
    ]);
  }
}
