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
import * as workerService from '../../services/workerService';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Check,
} from 'lucide-react-native';

const ABSENCE_REASONS = [
  'Medical Leave / Health Illness',
  'Family Emergency',
  'Transport / Commute Breakdown',
  'Severe Weather / Monsoon Disruption',
  'Personal Approved Leave',
];

export const WorkerAttendanceScreen = ({ navigation }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAcceptingId, setIsAcceptingId] = useState(null);

  // Absence Reason Modal State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reasonCategory, setReasonCategory] = useState(ABSENCE_REASONS[0]);
  const [reasonNote, setReasonNote] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await workerService.getAttendance();
      setAttendanceRecords(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load worker attendance records:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const handleAcceptTiming = async (attendanceId) => {
    setIsAcceptingId(attendanceId);
    try {
      await workerService.acceptAttendanceTiming(attendanceId);
      Alert.alert(
        'Shift Timing Confirmed!',
        'You have verified and accepted your shift timings. Your status is now marked as "Present".'
      );
      fetchAttendance();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept timing.');
    } finally {
      setIsAcceptingId(null);
    }
  };

  const handleSubmitAbsenceReason = async () => {
    if (!selectedRecord) return;
    setIsSubmittingReason(true);
    try {
      const fullReason = `${reasonCategory}: ${reasonNote || 'Field absence justified'}`;
      await workerService.submitAbsenceReason(selectedRecord.id, {
        absence_reason: fullReason,
      });

      Alert.alert(
        'Absence Reason Submitted',
        'Your justification has been submitted to the lead contractor for review.'
      );
      setSelectedRecord(null);
      fetchAttendance();
    } catch (err) {
      Alert.alert('Submission Failed', err.response?.data?.message || 'Failed to submit reason.');
    } finally {
      setIsSubmittingReason(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Shift Attendance..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Shift Attendance & Timing"
        subtitle="Review and Accept Logged Shifts"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.workflowBanner}>
          <Clock size={16} color={colors.gold700} style={{ marginRight: 6 }} />
          <Text style={styles.workflowText}>
            The contractor logs your daily shift hours. Click <Text style={styles.bold}>"Accept Timing"</Text> to verify and mark your attendance as <Text style={styles.bold}>Present</Text>.
          </Text>
        </View>

        {attendanceRecords.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Attendance Logs Found"
            description="When your contractor logs daily shifts on the muster roll, your shifts will appear here for verification."
          />
        ) : (
          attendanceRecords.map((att) => {
            const isAccepted = att.worker_acceptance === 'Accepted';
            const isAbsent = att.status === 'Absent';
            const inTime = att.clock_in ? att.clock_in.substring(11, 16) : '08:00';
            const outTime = att.clock_out ? att.clock_out.substring(11, 16) : '17:00';
            const shiftDate = att.clock_in ? att.clock_in.substring(0, 10) : 'Recent';

            return (
              <View key={att.id} style={styles.attCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerInfo}>
                    <Text style={styles.prjName}>{att.project_name || 'Building Site'}</Text>
                    <Text style={styles.dateText}>Shift Date: {shiftDate}</Text>
                  </View>
                  <AppBadge
                    label={isAccepted ? 'Present' : isAbsent ? 'Absent' : 'Awaiting Acceptance'}
                    variant={isAccepted ? 'Present' : isAbsent ? 'Absent' : 'warning'}
                  />
                </View>

                {/* Timings Details */}
                <View style={styles.timingBox}>
                  <View style={styles.timingCol}>
                    <Text style={styles.timingLabel}>In Time</Text>
                    <Text style={styles.timingVal}>{inTime}</Text>
                  </View>
                  <View style={styles.timingCol}>
                    <Text style={styles.timingLabel}>Out Time</Text>
                    <Text style={styles.timingVal}>{outTime}</Text>
                  </View>
                  <View style={styles.timingCol}>
                    <Text style={styles.timingLabel}>Logged Hours</Text>
                    <Text style={[styles.timingVal, { color: colors.gold600, fontWeight: '800' }]}>
                      {att.hours_worked || 8} hrs
                    </Text>
                  </View>
                </View>

                {/* Absence Reason (if present) */}
                {att.absence_reason ? (
                  <View style={styles.reasonBox}>
                    <Text style={styles.reasonLabel}>Absence Justification:</Text>
                    <Text style={styles.reasonText}>{att.absence_reason}</Text>
                  </View>
                ) : null}

                {/* Action Buttons */}
                <View style={styles.cardActions}>
                  {!isAccepted && !isAbsent && (
                    <AppButton
                      title="Accept Timing & Confirm Present"
                      icon={CheckCircle2}
                      size="sm"
                      isLoading={isAcceptingId === att.id}
                      onPress={() => handleAcceptTiming(att.id)}
                      style={{ flex: 1 }}
                    />
                  )}

                  {isAbsent && !att.absence_reason && (
                    <AppButton
                      title="Submit Absence Reason"
                      variant="outline"
                      size="sm"
                      icon={Send}
                      onPress={() => setSelectedRecord(att)}
                      style={{ flex: 1 }}
                    />
                  )}

                  {isAccepted && (
                    <View style={styles.confirmedRow}>
                      <CheckCircle2 size={16} color={colors.success} style={{ marginRight: 6 }} />
                      <Text style={styles.confirmedText}>Shift timing accepted & recorded.</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Submit Absence Reason Modal */}
      <AppModal
        visible={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Submit Absence Reason"
        subtitle="Justify missed shift to contractor"
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setSelectedRecord(null)} />
            <AppButton title="Submit Reason" size="sm" onPress={handleSubmitAbsenceReason} isLoading={isSubmittingReason} />
          </>
        }
      >
        <Text style={styles.modalLabel}>Select Reason Category:</Text>
        <View style={styles.reasonCategories}>
          {ABSENCE_REASONS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setReasonCategory(cat)}
              style={[styles.reasonPill, reasonCategory === cat ? styles.reasonPillActive : null]}
            >
              <Text style={[styles.reasonPillText, reasonCategory === cat ? styles.reasonPillTextActive : null]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppInput
          label="Additional Details / Doctor's Note Reference"
          value={reasonNote}
          onChangeText={setReasonNote}
          placeholder="Brief explanation for site records"
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
  workflowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  workflowText: {
    fontSize: 11,
    color: colors.gold900,
    flex: 1,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '800',
  },
  attCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  prjName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  dateText: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  timingBox: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  timingCol: {
    flex: 1,
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral400,
    textTransform: 'uppercase',
  },
  timingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral800,
    marginTop: 2,
  },
  reasonBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 11,
    color: colors.neutral800,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
    marginBottom: 8,
  },
  reasonCategories: {
    gap: 6,
    marginBottom: 14,
  },
  reasonPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  reasonPillActive: {
    backgroundColor: colors.gold50,
    borderColor: colors.gold400,
  },
  reasonPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral700,
  },
  reasonPillTextActive: {
    color: colors.gold900,
    fontWeight: '800',
  },
});
