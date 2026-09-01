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
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import apiClient from '../../services/apiClient';
import { User, Mail, Lock, Phone, Briefcase, ChevronLeft } from 'lucide-react-native';

const ROLES = ['Contractor', 'Homeowner', 'Worker'];

export const RegisterScreen = ({ navigation }) => {
  const [role, setRole] = useState('Homeowner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/register', {
        name,
        email: email.trim(),
        password,
        role,
        phone,
        company_name: role === 'Contractor' ? companyName : undefined,
      });

      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please sign in with your credentials.',
        [{ text: 'Sign In', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={20} color={colors.neutral700} />
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ConstructIQ platform</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.roleLabel}>I am registering as a:</Text>
            <View style={styles.rolePicker}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[styles.roleTab, role === r ? styles.roleTabActive : null]}
                >
                  <Text style={[styles.roleTabText, role === r ? styles.roleTabTextActive : null]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              leftIcon={User}
            />

            <AppInput
              label="Email Address *"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. john@example.com"
              keyboardType="email-address"
              leftIcon={Mail}
            />

            <AppInput
              label="Password *"
              value={password}
              onChangeText={setPassword}
              placeholder="Choose a strong password"
              secureTextEntry
              leftIcon={Lock}
            />

            <AppInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              leftIcon={Phone}
            />

            {role === 'Contractor' && (
              <AppInput
                label="Company / Enterprise Name"
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. Premier Builders Pvt Ltd"
                leftIcon={Briefcase}
              />
            )}

            <AppButton
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              size="lg"
              style={styles.submitBtn}
            />
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: colors.neutral700,
    fontWeight: '600',
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral950,
  },
  subtitle: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 2,
    marginBottom: 16,
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
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral600,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rolePicker: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral600,
  },
  roleTabTextActive: {
    color: colors.gold600,
    fontWeight: '800',
  },
  submitBtn: {
    marginTop: 10,
  },
});
