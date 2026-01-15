import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class AgeSelectionScreen extends StatelessWidget {
  const AgeSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/')),
        title: const Text('Select Your Age'),
        backgroundColor: Colors.white, elevation: 0,
      ),
      body: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('This helps us customize your experience',
                style: TextStyle(fontSize: 18, color: Colors.grey[700]), textAlign: TextAlign.center),
              const SizedBox(height: 24),
              Expanded(
                child: ListView(
                  children: [
                    _buildAgeOption(
                      icon: FontAwesomeIcons.child, title: '2-5 years', subtitle: 'Simple, voice navigation',
                      onTap: () => _selectAgeGroup('2-5', context),
                      color: Colors.pink.shade100, iconColor: Colors.pink.shade700,
                    ),
                    const SizedBox(height: 12),
                    _buildAgeOption(
                      icon: FontAwesomeIcons.users, title: '5-12 years', subtitle: 'Fun, educational, guided',
                      onTap: () => _selectAgeGroup('5-12', context),
                      color: Colors.orange.shade100, iconColor: Colors.orange.shade700,
                    ),
                    const SizedBox(height: 12),
                    _buildAgeOption(
                      icon: FontAwesomeIcons.userGraduate, title: '12-18 years', subtitle: 'Social, customizable',
                      onTap: () => _selectAgeGroup('12-18', context),
                      color: Colors.blue.shade100, iconColor: Colors.blue.shade700,
                    ),
                    const SizedBox(height: 12),
                    _buildAgeOption(
                      icon: FontAwesomeIcons.userTie, title: '18-50 years', subtitle: 'Professional, full features',
                      onTap: () => _selectAgeGroup('18-50', context),
                      color: Colors.green.shade100, iconColor: Colors.green.shade700,
                    ),
                    const SizedBox(height: 12),
                    _buildAgeOption(
                      icon: FontAwesomeIcons.userNurse, title: '50+ years', subtitle: 'Simplified, larger text',
                      onTap: () => _selectAgeGroup('50+', context),
                      color: Colors.purple.shade100, iconColor: Colors.purple.shade700,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  void _selectAgeGroup(String ageGroup, BuildContext context) {
    Provider.of<AgeGroupProvider>(context, listen: false).setAgeGroup(ageGroup);
    context.go('/auth-selection');
  }

  Widget _buildAgeOption({
    required IconData icon, required String title, required String subtitle,
    required VoidCallback onTap, required Color color, required Color iconColor,
  }) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: color, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap, borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              Container(width: 60, height: 60,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                child: Icon(icon, size: 28, color: iconColor),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(title, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: iconColor)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 14, color: iconColor.withValues(alpha: 0.8))),
                ]),
              ),
              Icon(Icons.arrow_forward_ios, color: iconColor.withValues(alpha: 0.6), size: 20),
            ]),
          ),
        ),
      ),
    );
  }
}
