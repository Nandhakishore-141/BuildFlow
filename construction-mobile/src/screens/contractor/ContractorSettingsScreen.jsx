import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import { useAuthStore } from '../../store/authStore';
import * as contractorService from '../../services/contractorService';
import { User, Briefcase, Phone, Mail, LogOut, ShieldCheck } from 'lucide-react-native';

export const ContractorSettingsScreen = ({ navigation }) => {
  const { user, logout, isImpersonating } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await contractorService.getSettings();
        const p = res.data?.data || res.data || {};
        setProfile(p);
        setName(p.name || user?.name || '');
        setCompanyName(p.company_name || '');
        setPhone(p.phone || '');
      } catch (err) {
        console.error('Failed to load contractor settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await contractorService.updateSettings({
        name,
        company_name: companyName,
        phone,
      });
      Alert.alert('Profile Saved', 'Your contractor account details have been updated.');
    } catch (err) {
      Alert.alert('Save Failed', err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of ConstructIQ?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (isLoading) return <LoadingScreen message="Loading Settings..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Settings & Profile"
        subtitle="Manage Account Preferences"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userBanner}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{(name || 'C')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name || user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleChip}>
              <ShieldCheck size={12} color={colors.gold700} style={{ marginRight: 4 }} />
              <Text style={styles.roleText}>Verified Contractor</Text>
            </View>
          </View>
        </View>

        {/* Profile Edit Card */}
        <AppCard title="Contractor Business Profile">
          <AppInput
            label="Full Contact Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Alex Turner"
            leftIcon={User}
            editable={!isImpersonating}
          />

          <AppInput
            label="Company / Enterprise Name"
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="e.g. ABC Constructions Ltd"
            leftIcon={Briefcase}
            editable={!isImpersonating}
          />

          <AppInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            leftIcon={Phone}
            editable={!isImpersonating}
          />

          {!isImpersonating && (
            <AppButton
              title="Save Profile"
              onPress={handleSave}
              isLoading={isSaving}
              size="md"
              style={{ marginTop: 6 }}
            />
          )}
        </AppCard>

        {/* Sign Out Card */}
        <AppCard title="Account Actions">
          <AppButton
            title="Sign Out of ConstructIQ"
            variant="danger"
            icon={LogOut}
            onPress={handleLogout}
          />
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral950,
  },
  userEmail: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 1,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.gold800,
  },
});
