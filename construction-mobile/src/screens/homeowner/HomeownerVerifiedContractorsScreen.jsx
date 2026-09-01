import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppBadge } from '../../components/common/AppBadge';
import { AppButton } from '../../components/common/AppButton';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as homeownerService from '../../services/homeownerService';
import { ShieldCheck, Star, Briefcase, Phone, Mail, Send } from 'lucide-react-native';

export const HomeownerVerifiedContractorsScreen = ({ navigation }) => {
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContractors = useCallback(async () => {
    try {
      const res = await homeownerService.getVerifiedContractors();
      setContractors(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load verified contractors:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContractors();
  };

  const handleInvite = (contractor) => {
    Alert.alert(
      'Invite Contractor',
      `Send a formal project tender invitation to ${contractor.name} (${contractor.company_name || 'Builder'})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Tender Invite',
          onPress: () => {
            Alert.alert(
              'Invitation Sent!',
              `Tender invitation sent to ${contractor.name}. They will submit a milestone proposal.`
            );
          },
        },
      ]
    );
  };

  if (isLoading) return <LoadingScreen message="Loading Verified Contractors..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Verified Builders Directory"
        subtitle={`${contractors.length} Certified Construction Companies`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {contractors.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Contractors Found"
            description="Verified construction companies vetted by ConstructIQ will appear here."
          />
        ) : (
          contractors.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(c.company_name || c.name || 'C')[0]}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.companyName}>{c.company_name || c.name}</Text>
                  <Text style={styles.leadName}>Lead: {c.name}</Text>
                  <View style={styles.verifiedRow}>
                    <ShieldCheck size={12} color={colors.gold700} style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedText}>ConstructIQ Certified • Grade A Builder</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsBar}>
                <View style={styles.statCol}>
                  <Text style={styles.statLbl}>Rating</Text>
                  <Text style={styles.statVal}>⭐ {c.rating || '4.9'}</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={styles.statLbl}>Projects Completed</Text>
                  <Text style={styles.statVal}>{c.projects_count || '12'}</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={styles.statLbl}>Experience</Text>
                  <Text style={styles.statVal}>8+ Years</Text>
                </View>
              </View>

              <AppButton
                title="Send Project Tender Invite"
                icon={Send}
                size="sm"
                onPress={() => handleInvite(c)}
                style={{ marginTop: 8 }}
              />
            </View>
          ))
        )}
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  info: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  leadName: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold800,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral400,
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.neutral800,
    marginTop: 2,
  },
});
