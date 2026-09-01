import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, Sparkles, User, Briefcase, HardHat, ShieldCheck } from 'lucide-react-native';

const DEMO_ACCOUNTS = [
  {
    role: 'Contractor',
    name: 'Alex Turner (ABC Constructions)',
    email: 'contact@abcconstructions.com',
    icon: Briefcase,
    color: colors.gold600,
    bg: colors.gold50,
  },
  {
    role: 'Worker',
    name: 'Arjun Sharma (Lead Mason)',
    email: 'arjun.sharma@worker.constructiq.com',
    icon: HardHat,
    color: '#059669',
    bg: colors.successLight,
  },
  {
    role: 'Homeowner',
    name: 'Robert Taylor (Villa Owner)',
    email: 'robert.taylor@homeowner.com',
    icon: User,
    color: '#2563EB',
    bg: colors.infoLight,
  },
  {
    role: 'Admin',
    name: 'Platform Administrator',
    email: 'admin@constructiq.com',
    icon: ShieldCheck,
    color: '#7C3AED',
    bg: colors.purpleLight,
  },
];

export const LoginScreen = ({ navigation }) => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (loginEmail, loginPass) => {
    const e = loginEmail || email;
    const p = loginPass || password;

    if (!e || !p) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(e.trim(), p);
    } catch (err) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid credentials or server offline.';
      setError(msg);
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword('pass');
    handleLogin(demo.email, 'pass');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoLetter}>C</Text>
            </View>
            <Text style={styles.brandTitle}>
              Construct<Text style={styles.goldText}>IQ</Text>
            </Text>
            <Text style={styles.brandSubtitle}>
              Smart Construction & Site Management Platform
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In to Workspace</Text>
            <Text style={styles.cardSubtitle}>
              Access your real-time site dashboard and project tools
            </Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <AppInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. alex@company.com"
              keyboardType="email-address"
              leftIcon={Mail}
            />

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your account password"
              secureTextEntry
              leftIcon={Lock}
            />

            <AppButton
              title="Sign In"
              onPress={() => handleLogin()}
              isLoading={isLoading}
              size="lg"
              style={styles.signInBtn}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Demo Logins */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeader}>
              <Sparkles size={16} color={colors.gold600} />
              <Text style={styles.demoTitle}>Quick 1-Click Demo Accounts</Text>
            </View>
            <Text style={styles.demoSubtitle}>
              Instantly explore role-tailored features (Universal password: 'pass')
            </Text>

            <View style={styles.demoGrid}>
              {DEMO_ACCOUNTS.map((demo) => {
                const IconComponent = demo.icon;
                return (
                  <TouchableOpacity
                    key={demo.role}
                    activeOpacity={0.8}
                    onPress={() => handleQuickLogin(demo)}
                    style={[styles.demoCard, { backgroundColor: demo.bg }]}
                  >
                    <View style={styles.demoCardTop}>
                      <View style={[styles.demoIconWrap, { backgroundColor: colors.white }]}>
                        <IconComponent size={16} color={demo.color} />
                      </View>
                      <Text style={[styles.demoRoleBadge, { color: demo.color }]}>
                        {demo.role}
                      </Text>
                    </View>
                    <Text style={styles.demoName} numberOfLines={1}>{demo.name}</Text>
                    <Text style={styles.demoEmail} numberOfLines={1}>{demo.email}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.gold500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  logoLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.neutral950,
    letterSpacing: -0.5,
  },
  goldText: {
    color: colors.gold500,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral950,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 2,
    marginBottom: 18,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  signInBtn: {
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
    color: colors.neutral500,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gold600,
  },
  demoSection: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral900,
  },
  demoSubtitle: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
    marginBottom: 12,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  demoCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  demoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  demoIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoRoleBadge: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  demoName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral950,
  },
  demoEmail: {
    fontSize: 10,
    color: colors.neutral500,
    marginTop: 2,
  },
});
