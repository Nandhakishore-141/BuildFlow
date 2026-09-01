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
import { AppCard } from '../../components/common/AppCard';
import { StatCard } from '../../components/common/StatCard';
import { AppBadge } from '../../components/common/AppBadge';
import { AppButton } from '../../components/common/AppButton';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as workerService from '../../services/workerService';
import * as projectService from '../../services/projectService';
import {
  HardHat,
  Building2,
  CalendarCheck,
  ListTodo,
  Upload,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Camera,
} from 'lucide-react-native';

export const WorkerDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({});
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const [statsRes, projectsRes, tasksRes, invRes] = await Promise.all([
        workerService.getDashboardStats(),
        projectService.getProjects({ limit: 10 }),
        workerService.getTasks(),
        workerService.getInvitations(),
      ]);

      setStats(statsRes.data?.data || statsRes.data || {});

      const rawProjects = projectsRes.data?.data?.data || projectsRes.data?.data || projectsRes.data || [];
      setAssignedProjects(Array.isArray(rawProjects) ? rawProjects : (Array.isArray(rawProjects?.data) ? rawProjects.data : []));

      const rawTasks = tasksRes.data?.data || tasksRes.data || [];
      setTasks(Array.isArray(rawTasks) ? rawTasks : []);

      const rawInv = invRes.data?.data || invRes.data || [];
      setInvitations(Array.isArray(rawInv) ? rawInv : []);
    } catch (err) {
      console.error('Failed to load worker dashboard:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleRespondInvitation = async (invitationId, action) => {
    try {
      await workerService.respondToInvitation(invitationId, action);
      Alert.alert(
        action === 'accept' ? 'Invitation Accepted' : 'Invitation Declined',
        action === 'accept' ? 'You are now an active team member of the building site!' : 'Invitation dismissed.'
      );
      fetchDashboard();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to respond.');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading Worker Workspace..." />;

  const activeProject = stats.activeProject || assignedProjects[0];
  const todayAttendance = stats.todayAttendance || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImpersonationBanner />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>Worker Field App</Text>
            <Text style={styles.headline}>Site Shift Hub</Text>
          </View>
          <View style={[styles.brandIcon, { backgroundColor: colors.success }]}>
            <HardHat size={22} color={colors.white} />
          </View>
        </View>

        {/* Pending Project Invitations */}
        {invitations.length > 0 && (
          <View style={styles.invitationAlert}>
            <Text style={styles.invTitle}>New Project Invitation Received!</Text>
            <Text style={styles.invText}>
              Contractor has invited you to join <Text style={styles.bold}>{invitations[0].project_name}</Text>.
            </Text>
            <View style={styles.invActions}>
              <AppButton
                title="Accept"
                size="sm"
                onPress={() => handleRespondInvitation(invitations[0].id || invitations[0].invitation_id, 'accept')}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Decline"
                variant="outline"
                size="sm"
                onPress={() => handleRespondInvitation(invitations[0].id || invitations[0].invitation_id, 'reject')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {/* 4 KPIs */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Assigned Sites"
              value={assignedProjects.length}
              subtitle="Active Building Teams"
              icon={Building2}
              color="gold"
            />
            <StatCard
              title="Shift Attendance"
              value={stats.monthlyAttendanceCount || 0}
              subtitle="Logged This Month"
              icon={CalendarCheck}
              color="emerald"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Pending Tasks"
              value={tasks.filter((t) => t.status !== 'Completed').length}
              subtitle="Assigned To-Do"
              icon={ListTodo}
              color="blue"
            />
            <StatCard
              title="Today's Shift"
              value={todayAttendance.status || 'Active'}
              subtitle="Attendance State"
              icon={Clock}
              color="purple"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('WorkerAttendance')}
          >
            <CalendarCheck size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Review Timing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('WorkerTasks')}
          >
            <ListTodo size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>My Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('WorkerUploadProgress')}
          >
            <Camera size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Active Project Card */}
        {activeProject ? (
          <AppCard
            title="Primary Assigned Construction Site"
            subtitle={activeProject.project_code || 'SITE-01'}
            rightAction={
              <AppBadge label={activeProject.status || 'In Progress'} variant="In Progress" />
            }
          >
            <Text style={styles.activePrjName}>{activeProject.project_name}</Text>
            <Text style={styles.activePrjDesc} numberOfLines={2}>{activeProject.description}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.neutral500} style={{ marginRight: 4 }} />
              <Text style={styles.locationText}>{activeProject.address || 'Plot 42, Outer Ring Road'}</Text>
            </View>
          </AppCard>
        ) : null}

        {/* Assigned Tasks Checklist */}
        <AppCard
          title={`Assigned Tasks (${tasks.length})`}
          subtitle="Field checklist & milestones"
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('WorkerTasks')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          }
        >
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>No pending tasks assigned right now.</Text>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskPrj}>{task.project_name || 'Building Site'}</Text>
                </View>
                <AppBadge
                  label={task.status || 'Pending'}
                  variant={task.status === 'Completed' ? 'Completed' : 'warning'}
                />
              </View>
            ))
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
    paddingBottom: 32,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.neutral950,
    letterSpacing: -0.3,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitationAlert: {
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold300,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  invTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gold900,
  },
  invText: {
    fontSize: 12,
    color: colors.gold800,
    marginTop: 2,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '800',
  },
  invActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statsGrid: {
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  actionPill: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral800,
  },
  activePrjName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral950,
  },
  activePrjDesc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 4,
    lineHeight: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 11,
    color: colors.neutral500,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold600,
  },
  emptyText: {
    fontSize: 12,
    color: colors.neutral400,
    textAlign: 'center',
    paddingVertical: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  taskPrj: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 1,
  },
});
