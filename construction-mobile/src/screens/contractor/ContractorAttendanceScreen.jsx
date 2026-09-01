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
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  Calendar,
  Save,
} from 'lucide-react-native';

export const ContractorAttendanceScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [workers, setWorkers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [musterRoll, setMusterRoll] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const selectedDate = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [prjRes, wrkRes, attRes] = await Promise.all([
        contractorService.getProjects(),
        contractorService.getWorkers(),
        contractorService.getAttendance(selectedDate, selectedProjectId),
      ]);

      const prjList = prjRes.data?.data || prjRes.data || [];
      setProjects(prjList);
      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }

      const wrkList = wrkRes.data?.data || wrkRes.data || [];
      setWorkers(wrkList);

      const attList = attRes.data?.data || attRes.data || [];
      setAttendanceRecords(attList);

      // Populate muster roll sheet
      const initialSheet = {};
      wrkList.forEach((w) => {
        const existing = attList.find((a) => a.worker_id === w.id);
        initialSheet[w.id] = {
          status: existing?.status || 'Present',
          inTime: existing?.clock_in ? existing.clock_in.substring(11, 16) : '08:00',
          outTime: existing?.clock_out ? existing.clock_out.substring(11, 16) : '17:00',
          hours: existing?.hours_worked || 8,
          workerAcceptance: existing?.worker_acceptance || 'Pending',
          absenceReason: existing?.absence_reason || null,
        };
      });
      setMusterRoll(initialSheet);
    } catch (err) {
      console.error('Failed to load attendance data:', err);
      setError(err.response?.data?.message || 'Failed to load attendance muster roll.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedProjectId, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const updateWorkerMuster = (workerId, field, value) => {
    setMusterRoll((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [field]: value,
      },
    }));
  };

  const handleSaveMuster = async () => {
    if (!selectedProjectId) {
      Alert.alert('Selection Required', 'Please select a project site.');
      return;
    }

    setIsSaving(true);
    try {
      const logs = workers.map((w) => {
        const m = musterRoll[w.id] || {};
        return {
          worker_id: w.id,
          project_id: selectedProjectId,
          date: selectedDate,
          clock_in: `${selectedDate} ${m.inTime || '08:00'}:00`,
          clock_out: m.status === 'Present' ? `${selectedDate} ${m.outTime || '17:00'}:00` : null,
          hours_worked: m.status === 'Present' ? parseFloat(m.hours || 8) : 0,
          status: m.status || 'Present',
        };
      });

      for (const log of logs) {
        await contractorService.markAttendance(log);
      }

      Alert.alert(
        'Muster Roll Logged',
        'Daily shifts recorded! Workers have been notified to review and click "Accept Timing" on their app.'
      );
      fetchData();
    } catch (err) {
      console.error('Failed to save attendance muster:', err);
      Alert.alert('Save Failed', err.response?.data?.message || 'Failed to log attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Daily Muster Sheet..." />;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Daily Muster Roll"
        subtitle={`Site Attendance Sheet • ${selectedDate}`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Selector Horizontal Scroll */}
        <View style={styles.projectSelector}>
          <Text style={styles.sectionLabel}>Select Building Site:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectPills}>
            {projects.map((prj) => {
              const active = prj.id === selectedProjectId;
              return (
                <TouchableOpacity
                  key={prj.id}
                  onPress={() => setSelectedProjectId(prj.id)}
                  style={[styles.projectPill, active ? styles.projectPillActive : null]}
                >
                  <Building2 size={14} color={active ? colors.white : colors.neutral700} />
                  <Text style={[styles.projectPillText, active ? styles.projectPillTextActive : null]}>
                    {prj.project_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Workflow Info Alert */}
        <View style={styles.infoBox}>
          <Clock size={16} color={colors.gold700} style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>
            Logged shifts start as <Text style={styles.bold}>Awaiting Worker Acceptance</Text>. Status turns to <Text style={styles.bold}>Present</Text> only when the worker accepts timing.
          </Text>
        </View>

        {/* Workers Muster List */}
        <AppCard
          title={`Registered Workforce (${workers.length})`}
          subtitle={`Assign shift timings for ${currentProject.project_name || 'Site'}`}
        >
          {workers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Workers Registered"
              description="Add workers to your team from the Workers directory."
            />
          ) : (
            workers.map((worker) => {
              const m = musterRoll[worker.id] || { status: 'Present', inTime: '08:00', outTime: '17:00' };
              const isPresent = m.status === 'Present';

              return (
                <View key={worker.id} style={styles.workerCard}>
                  <View style={styles.workerHeader}>
                    <View>
                      <Text style={styles.workerName}>{worker.name}</Text>
                      <Text style={styles.workerTrade}>{worker.trade || 'Mason / Labor'} • #{worker.worker_code || 'WRK-01'}</Text>
                    </View>
                    <AppBadge
                      label={
                        m.workerAcceptance === 'Accepted'
                          ? 'Present (Verified)'
                          : isPresent
                          ? 'Awaiting Acceptance'
                          : 'Marked Absent'
                      }
                      variant={
                        m.workerAcceptance === 'Accepted'
                          ? 'Present'
                          : isPresent
                          ? 'warning'
                          : 'Absent'
                      }
                    />
                  </View>

                  {/* Presence Toggle Buttons */}
                  <View style={styles.presenceRow}>
                    <TouchableOpacity
                      onPress={() => updateWorkerMuster(worker.id, 'status', 'Present')}
                      style={[styles.statusBtn, isPresent ? styles.presentBtnActive : null]}
                    >
                      <CheckCircle2 size={14} color={isPresent ? colors.white : colors.success} />
                      <Text style={[styles.statusBtnText, isPresent ? styles.statusBtnTextActive : null]}>
                        Present
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => updateWorkerMuster(worker.id, 'status', 'Absent')}
                      style={[styles.statusBtn, !isPresent ? styles.absentBtnActive : null]}
                    >
                      <AlertCircle size={14} color={!isPresent ? colors.white : colors.danger} />
                      <Text style={[styles.statusBtnText, !isPresent ? styles.statusBtnTextActive : null]}>
                        Absent
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Timing Inputs (if Present) */}
                  {isPresent ? (
                    <View style={styles.timingRow}>
                      <View style={styles.timingCol}>
                        <Text style={styles.timingLabel}>Clock In</Text>
                        <View style={styles.timeBox}>
                          <Text style={styles.timeVal}>{m.inTime || '08:00'}</Text>
                        </View>
                      </View>
                      <View style={styles.timingCol}>
                        <Text style={styles.timingLabel}>Clock Out</Text>
                        <View style={styles.timeBox}>
                          <Text style={styles.timeVal}>{m.outTime || '17:00'}</Text>
                        </View>
                      </View>
                      <View style={styles.timingCol}>
                        <Text style={styles.timingLabel}>Hours</Text>
                        <View style={styles.timeBox}>
                          <Text style={[styles.timeVal, { color: colors.gold600, fontWeight: '800' }]}>
                            {m.hours || 8} hrs
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.absenceBox}>
                      <Text style={styles.absenceText}>
                        {m.absenceReason ? `Reason submitted: "${m.absenceReason}"` : 'Worker must submit absence reason upon notification.'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </AppCard>

        {/* Save Attendance Button */}
        <AppButton
          title="Save & Submit Daily Muster Roll"
          onPress={handleSaveMuster}
          isLoading={isSaving}
          icon={Save}
          size="lg"
          style={styles.saveBtn}
        />
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
  projectSelector: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral500,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  projectPills: {
    gap: 8,
  },
  projectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    gap: 6,
  },
  projectPillActive: {
    backgroundColor: colors.gold500,
    borderColor: colors.gold500,
  },
  projectPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
  },
  projectPillTextActive: {
    color: colors.white,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  infoText: {
    fontSize: 11,
    color: colors.gold900,
    flex: 1,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '800',
  },
  workerCard: {
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 12,
    marginBottom: 12,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  workerName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
  },
  workerTrade: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  presenceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    gap: 4,
  },
  presentBtnActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  absentBtnActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
  },
  statusBtnTextActive: {
    color: colors.white,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  timingCol: {
    flex: 1,
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral400,
    marginBottom: 2,
  },
  timeBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.neutral50,
  },
  timeVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral800,
  },
  absenceBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 8,
    padding: 8,
  },
  absenceText: {
    fontSize: 11,
    color: '#991B1B',
    fontStyle: 'italic',
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
