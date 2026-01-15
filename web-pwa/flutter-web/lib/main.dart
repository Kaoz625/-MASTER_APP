import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'screens/landing_screen.dart';
import 'screens/age_selection_screen.dart';
import 'screens/auth_selection_screen.dart';
import 'screens/main_app_screen.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _userId;
  String? _userEmail;
  String? _ageGroup;
  bool _isAdmin = false;

  bool get isAuthenticated => _isAuthenticated;
  String? get userId => _userId;
  String? get userEmail => _userEmail;
  String? get ageGroup => _ageGroup;
  bool get isAdmin => _isAdmin;

  void login(String userId, String email, String ageGroup, {bool admin = false}) {
    _isAuthenticated = true;
    _userId = userId;
    _userEmail = email;
    _ageGroup = ageGroup;
    _isAdmin = admin;
    notifyListeners();
  }

  void logout() {
    _isAuthenticated = false;
    _userId = null;
    _userEmail = null;
    _ageGroup = null;
    _isAdmin = false;
    notifyListeners();
  }
}

class UserProvider with ChangeNotifier {
  Map<String, dynamic>? _userData;
  Map<String, dynamic>? get userData => _userData;
  void updateUserData(Map<String, dynamic> data) {
    _userData = data;
    notifyListeners();
  }
}

class AgeGroupProvider with ChangeNotifier {
  String _selectedAgeGroup = 'adult';
  String get selectedAgeGroup => _selectedAgeGroup;
  void setAgeGroup(String ageGroup) {
    _selectedAgeGroup = ageGroup;
    notifyListeners();
  }
}

class LocationProvider with ChangeNotifier {
  bool _permissionGranted = false;
  String? _currentLocation;
  bool get permissionGranted => _permissionGranted;
  String? get currentLocation => _currentLocation;
  Future<void> requestPermission() async {
    _permissionGranted = true;
    notifyListeners();
  }
  void setLocation(String location) {
    _currentLocation = location;
    notifyListeners();
  }
}

void main() {
  runApp(const MasterApp());
}

class MasterApp extends StatelessWidget {
  const MasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => AgeGroupProvider()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: MaterialApp.router(
        title: 'Master App',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Color(0xFF4A90E2),
            primary: Color(0xFF4A90E2),
            secondary: Color(0xFF6BA9F5),
          ),
        ),
        routerConfig: GoRouter(
          initialLocation: '/',
          routes: [
            GoRoute(path: '/', builder: (_, __) => const LandingScreen()),
            GoRoute(path: '/age-selection', builder: (_, __) => const AgeSelectionScreen()),
            GoRoute(path: '/auth-selection', builder: (_, __) => const AuthSelectionScreen()),
            GoRoute(path: '/main', builder: (_, __) => const MainAppScreen()),
            GoRoute(path: '/lockout', builder: (_, __) => const LockoutScreen()),
          ],
          errorPageBuilder: (context, state) => MaterialPage(
            child: Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 64, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Page not found: ${state.uri}'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => context.go('/'),
                      child: const Text('Go Home'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class LockoutScreen extends StatelessWidget {
  const LockoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.lock_outline, size: 80, color: Colors.red.shade700),
                const SizedBox(height: 24),
                Text('Account Temporarily Locked',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: Colors.red.shade700, fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Too many failed login attempts.\nPlease wait 15 minutes or use password recovery.',
                  style: TextStyle(fontSize: 16), textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                ElevatedButton.icon(
                  onPressed: () => context.go('/auth-selection'),
                  icon: const Icon(Icons.lock_open),
                  label: const Text('Forgot Password?'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.go('/'),
                  child: const Text('Go Back'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
