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
import { AppCard } from '../../components/common/AppCard';
import { AppBadge } from '../../components/common/AppBadge';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppModal } from '../../components/common/AppModal';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import apiClient from '../../services/apiClient';
import {
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  DollarSign,
} from 'lucide-react-native';

export const ContractorOpportunitiesScreen = ({ navigation }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Proposal Bid Modal State
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState('24');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await contractorService.getOpportunities();
      setOpportunities(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOpportunities();
  };

  const handleOpenBidModal = (opp) => {
    setSelectedOpp(opp);
    setBidAmount(String(opp.budget || ''));
    setCoverNote('');
  };

  const handleSubmitProposal = async () => {
    if (!selectedOpp || !bidAmount) {
      Alert.alert('Required Fields', 'Please enter your proposed bid amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/contractor/opportunities/${selectedOpp.id}/proposals`, {
        proposed_budget: parseFloat(bidAmount) || 0,
        timeline_weeks: parseInt(timelineWeeks, 10) || 24,
        cover_note: coverNote,
      });

      Alert.alert(
        'Proposal Submitted!',
        `Your bid has been sent to the property owner (${selectedOpp.owner_name || 'Homeowner'}). You will be notified when they review it.`
      );
      setSelectedOpp(null);
      fetchOpportunities();
    } catch (err) {
      Alert.alert('Bid Submission Failed', err.response?.data?.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Opportunities & Tenders..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Project Opportunities"
        subtitle={`${opportunities.length} Live Construction Requests`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {opportunities.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Open Opportunities"
            description="New property development projects posted by verified homeowners will appear here."
          />
        ) : (
          opportunities.map((opp) => (
            <View key={opp.id} style={styles.oppCard}>
              <View style={styles.oppTop}>
                <View style={styles.infoWrap}>
                  <Text style={styles.title}>{opp.project_name}</Text>
                  <Text style={styles.sub}>
                    Owner: {opp.owner_name || 'Homeowner'} • {opp.city || 'Bangalore'}
                  </Text>
                </View>
                <AppBadge
                  label={opp.has_bid ? 'Proposal Sent' : 'Open for Bid'}
                  variant={opp.has_bid ? 'Present' : 'gold'}
                />
              </View>

              <Text style={styles.desc} numberOfLines={3}>{opp.description}</Text>

              <View style={styles.kpiRow}>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLabel}>Target Budget</Text>
                  <Text style={styles.kpiVal}>{formatCurrency(opp.budget)}</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLabel}>Type</Text>
                  <Text style={styles.kpiVal}>{opp.project_type || 'Residential'}</Text>
                </View>
              </View>

              {!opp.has_bid && (
                <AppButton
                  title="Submit Formal Proposal / Bid"
                  onPress={() => handleOpenBidModal(opp)}
                  icon={Send}
                  size="sm"
                  style={styles.bidBtn}
                />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bid Modal */}
      <AppModal
        visible={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        title="Submit Construction Proposal"
        subtitle={selectedOpp?.project_name}
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setSelectedOpp(null)} />
            <AppButton title="Submit Bid" size="sm" onPress={handleSubmitProposal} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Proposed Budget (INR ₹) *"
          value={bidAmount}
          onChangeText={setBidAmount}
          placeholder="e.g. 48000000"
          keyboardType="numeric"
          leftIcon={DollarSign}
        />

        <AppInput
          label="Estimated Timeline (Weeks)"
          value={timelineWeeks}
          onChangeText={setTimelineWeeks}
          placeholder="e.g. 24"
          keyboardType="numeric"
        />

        <AppInput
          label="Proposal Pitch & Scope"
          value={coverNote}
          onChangeText={setCoverNote}
          placeholder="Describe your execution strategy, materials grade, and team allocation."
          multiline
          numberOfLines={3}
        />
      </AppModal>
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
  oppCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 14,
  },
  oppTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  sub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: colors.neutral700,
    lineHeight: 16,
    marginBottom: 10,
  },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  kpiCol: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral400,
    textTransform: 'uppercase',
  },
  kpiVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.neutral800,
    marginTop: 2,
  },
  bidBtn: {
    marginTop: 4,
  },
});
