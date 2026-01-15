import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class MainAppScreen extends StatefulWidget {
  const MainAppScreen({super.key});

  @override
  State<MainAppScreen> createState() => _MainAppState();
}

class _MainAppState extends State<MainAppScreen> with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  bool _isAdmin = false;

  final List<TabData> _tabs = [
    TabData(index: 0, icon: Icons.home, label: 'HOME'),
    TabData(index: 1, icon: Icons.live_tv, label: 'LIVE'),
    TabData(index: 2, icon: Icons.feed, label: 'FEED'),
    TabData(index: 3, icon: Icons.mic, label: 'MIC'),
    TabData(index: 4, icon: Icons.map, label: 'MAP'),
    TabData(index: 5, icon: Icons.person, label: 'PROFILE'),
  ];

  late final AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _checkAdminStatus();
    _animationController = AnimationController(duration: const Duration(milliseconds: 800), vsync: this);
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _checkAdminStatus() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() {
      _isAdmin = authProvider.isAdmin;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            if (_isAdmin) const AdminPanel() else const SizedBox.shrink(),
            Expanded(child: _buildTabContent(_currentIndex)),
            _buildBottomNavBar(),
          ],
        ),
      ),
    );
  }

  Widget _buildTabContent(int index) {
    switch (index) {
      case 0: return const HomeTabContent();
      case 1: return const LiveTabContent();
      case 2: return const FeedTabContent();
      case 3: return const MicTabContent();
      case 4: return const MapTabContent();
      case 5: return const ProfileTabContent();
      default: return const Center(child: Text('Coming Soon'));
    }
  }

  Widget _buildBottomNavBar() {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, -2))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: _tabs.map((tab) {
          final bool isActive = _currentIndex == tab.index;
          return Expanded(
            child: InkWell(
              onTap: () => setState(() => _currentIndex = tab.index),
              child: Container(
                color: isActive ? const Color(0xFF4A90E2) : Colors.transparent,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(tab.icon, size: 28, color: isActive ? Colors.white : Colors.grey[600]),
                    const SizedBox(height: 4),
                    Text(tab.label, style: TextStyle(
                      fontSize: 11, fontWeight: FontWeight.bold,
                      color: isActive ? Colors.white : Colors.grey[600],
                    )),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class TabData {
  final int index;
  final IconData icon;
  final String label;
  const TabData({required this.index, required this.icon, required this.label});
}

class HomeTabContent extends StatelessWidget {
  const HomeTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('OH YEA WE DID IT BABY',
            style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Color(0xFF2D3748), letterSpacing: 1),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          const Icon(Icons.celebration, size: 64, color: Color(0xFF4A90E2)),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text('Your Master App foundation is ready!\n\nExplore all features from the tabs below.',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]), textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

class LiveTabContent extends StatelessWidget {
  const LiveTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(16)),
            child: Icon(Icons.live_tv, size: 64, color: Colors.red.shade700),
          ),
          const SizedBox(height: 24),
          const Text('LIVE', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D3748))),
          const SizedBox(height: 16),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text('Live features coming soon!\nReal-time streaming and updates.',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]), textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

class FeedTabContent extends StatelessWidget {
  const FeedTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(16)),
          child: Icon(Icons.feed, size: 64, color: Colors.blue.shade700),
        ),
        const SizedBox(height: 24),
        const Text('FEED', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D3748))),
        const SizedBox(height: 16),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text('Your feed coming soon!\nPersonalized content and updates.',
            style: TextStyle(fontSize: 14, color: Colors.grey[600]), textAlign: TextAlign.center,
          ),
        ),
      ]),
    );
  }
}

class MicTabContent extends StatelessWidget {
  const MicTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.purple.shade50, borderRadius: BorderRadius.circular(16)),
          child: const Icon(Icons.mic, size: 64, color: Colors.purple),
        ),
        const SizedBox(height: 24),
        const Text('MIC', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D3748))),
        const SizedBox(height: 16),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text('Voice navigation enabled!\nTap the microphone to speak commands.',
            style: TextStyle(fontSize: 14, color: Colors.grey[600]), textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () {}, icon: const Icon(Icons.mic), label: const Text('Test Voice Command'),
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
        ),
      ]),
    );
  }
}

class MapTabContent extends StatelessWidget {
  const MapTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(16)),
          child: Icon(Icons.map, size: 64, color: Colors.green.shade700),
        ),
        const SizedBox(height: 24),
        const Text('MAP', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D3748))),
        const SizedBox(height: 16),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text('Real-time location coming soon!\nGPS tracking with age-appropriate privacy.',
            style: TextStyle(fontSize: 14, color: Colors.grey[600]), textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () => Provider.of<LocationProvider>(context, listen: false).requestPermission(),
          icon: const Icon(Icons.location_on), label: const Text('Enable Location'),
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
        ),
      ]),
    );
  }
}

class ProfileTabContent extends StatelessWidget {
  const ProfileTabContent({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 100, height: 100,
          decoration: BoxDecoration(color: const Color(0xFF4A90E2), borderRadius: BorderRadius.circular(50)),
          child: const Icon(Icons.person, size: 50, color: Colors.white),
        ),
        const SizedBox(height: 24),
        Text(authProvider.userEmail ?? 'User',
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF2D3748)),
        ),
        if (authProvider.ageGroup != null)
          Padding(padding: const EdgeInsets.only(top: 8),
            child: Text('Age Group: ${authProvider.ageGroup}',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
          ),
        const SizedBox(height: 32),
        ElevatedButton.icon(
          onPressed: () {
            authProvider.logout();
            context.go('/');
          },
          icon: const Icon(Icons.logout), label: const Text('Logout'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red.shade100, foregroundColor: Colors.red.shade700,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
          ),
        ),
      ]),
    );
  }
}

class AdminPanel extends StatelessWidget {
  const AdminPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.admin_panel_settings, color: Colors.red.shade700, size: 28),
          const SizedBox(width: 12),
          Text('ADMIN DASHBOARD',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red.shade700),
          ),
        ]),
        const SizedBox(height: 16),
        _buildAdminMenuItem(icon: Icons.people, label: 'Manage Users', onTap: () {}),
        const SizedBox(height: 8),
        _buildAdminMenuItem(icon: Icons.analytics, label: 'View Analytics', onTap: () {}),
        const SizedBox(height: 8),
        _buildAdminMenuItem(icon: Icons.settings, label: 'App Settings', onTap: () {}),
        const SizedBox(height: 8),
        _buildAdminMenuItem(icon: Icons.attach_money, label: 'Monetization', onTap: () {}),
        const SizedBox(height: 8),
        _buildAdminMenuItem(icon: Icons.security, label: 'Security', onTap: () {}),
      ]),
    );
  }

  Widget _buildAdminMenuItem({required IconData icon, required String label, required VoidCallback onTap}) {
    return Container(
      height: 48,
      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(8)),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap, borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(children: [
              Icon(icon, size: 20, color: Colors.red.shade700),
              const SizedBox(width: 12),
              Expanded(child: Text(label,
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.red.shade700),
              )),
              Icon(Icons.arrow_forward_ios, size: 16, color: Colors.red.shade700.withValues(alpha: 0.6)),
            ]),
          ),
        ),
      ),
    );
  }
}
