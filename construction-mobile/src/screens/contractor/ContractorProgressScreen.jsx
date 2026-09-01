import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Image,
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
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  Camera,
  Check,
  Percent,
} from 'lucide-react-native';

export const ContractorProgressScreen = ({ navigation }) => {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Approval Modal States
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState('70');
  const [isApproving, setIsApproving] = useState(false);

  const fetchUpdates = useCallback(async () => {
    try {
      const res = await contractorService.getProgressUpdates();
      setUpdates(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load progress updates:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUpdates();
  };

  const handleOpenApproveModal = (update) => {
    setSelectedUpdate(update);
    setCompletionPercentage(String(update.project_completion || '70'));
  };

  const handleApprove = async () => {
    if (!selectedUpdate) return;
    setIsApproving(true);
    try {
      await contractorService.approveProgressUpdate(selectedUpdate.id, {
        completion_percentage: parseFloat(completionPercentage) || 70,
      });

      Alert.alert(
        'Progress Approved',
        `Site progress verified and project completion updated to ${completionPercentage}%.`
      );
      setSelectedUpdate(null);
      fetchUpdates();
    } catch (err) {
      Alert.alert('Approval Failed', err.response?.data?.message || 'Failed to approve update.');
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Progress Updates..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Site Progress Updates"
        subtitle={`${updates.length} Verification Submissions`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {updates.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No Progress Updates Submitted"
            description="Field workers can upload site progress photos and milestones from their Worker app."
          />
        ) : (
          updates.map((item) => (
            <View key={item.id} style={styles.updateCard}>
              <View style={styles.cardTop}>
                <View style={styles.infoLeft}>
                  <Text style={styles.projectName}>{item.project_name || 'Building Site'}</Text>
                  <Text style={styles.subText}>
                    Submitted by {item.worker_name || 'Site Mason'} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>
                <AppBadge
                  label={item.approval_status || 'Pending Verification'}
                  variant={item.approval_status === 'Approved' ? 'Approved' : 'Pending'}
                />
              </View>

              {item.file_url ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.file_url }} style={styles.photo} resizeMode="cover" />
                </View>
              ) : null}

              <Text style={styles.descText}>{item.description || 'Site milestone progress log.'}</Text>

              {item.approval_status !== 'Approved' && (
                <AppButton
                  title="Review & Verify Progress"
                  onPress={() => handleOpenApproveModal(item)}
                  icon={CheckCircle2}
                  size="sm"
                  style={styles.reviewBtn}
                />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Approve Progress Modal */}
      <AppModal
        visible={!!selectedUpdate}
        onClose={() => setSelectedUpdate(null)}
        title="Verify & Approve Progress Update"
        subtitle={selectedUpdate?.project_name}
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setSelectedUpdate(null)} />
            <AppButton title="Approve & Set %" size="sm" onPress={handleApprove} isLoading={isApproving} />
          </>
        }
      >
        <Text style={styles.modalText}>
          {selectedUpdate?.description}
        </Text>

        <AppInput
          label="New Project Completion Percentage (%)"
          value={completionPercentage}
          onChangeText={setCompletionPercentage}
          placeholder="e.g. 75"
          keyboardType="numeric"
          leftIcon={Percent}
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
  updateCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLeft: {
    flex: 1,
    marginRight: 8,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  subText: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.neutral900,
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  descText: {
    fontSize: 13,
    color: colors.neutral700,
    lineHeight: 18,
    marginBottom: 10,
  },
  reviewBtn: {
    marginTop: 4,
  },
  modalText: {
    fontSize: 13,
    color: colors.neutral700,
    marginBottom: 14,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
