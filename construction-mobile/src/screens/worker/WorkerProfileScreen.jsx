import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import { useAuthStore } from '../../store/authStore';
import * as workerService from '../../services/workerService';
import { User, Phone, MapPin, Briefcase, Award, HardHat } from 'lucide-react-native';

export const WorkerProfileScreen = ({ navigation }) => {
  const { user, isImpersonating } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await workerService.getProfile();
        const p = res.data?.data || res.data || {};
        setProfile(p);
        setName(p.name || user?.name || '');
        setPhone(p.phone || '');
        setSkill(p.skill || 'Masonry');
        setExperience(String(p.experience || '5'));
        setAddress(p.address || '');
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await workerService.updateProfile({
        name,
        phone,
        skill,
        experience,
        address,
      });
      Alert.alert('Profile Updated', 'Your trade qualifications and contact details have been saved.');
    } catch (err) {
      Alert.alert('Save Failed', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Worker Profile..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Worker Profile"
        subtitle="Trade & Experience Credentials"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Banner */}
        <View style={styles.userBanner}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{(name || 'W')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name || user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.skillBadge}>
              <HardHat size={12} color="#065F46" style={{ marginRight: 4 }} />
              <Text style={styles.skillBadgeText}>{skill || 'Skilled Mason'}</Text>
            </View>
          </View>
        </View>

        <AppCard title="Trade Credentials & Details">
          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Arjun Sharma"
            leftIcon={User}
            editable={!isImpersonating}
          />

          <AppInput
            label="Primary Trade Skill"
            value={skill}
            onChangeText={setSkill}
            placeholder="Mason, Electrician, Plumber, Carpenter"
            leftIcon={Award}
            editable={!isImpersonating}
          />

          <AppInput
            label="Years of Experience"
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 6"
            keyboardType="numeric"
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

          <AppInput
            label="Residential Address / City"
            value={address}
            onChangeText={setAddress}
            placeholder="e.g. Bangalore, Karnataka"
            leftIcon={MapPin}
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
    backgroundColor: colors.success,
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
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  skillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
});
