import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AppCard } from '../../components/common/AppCard';
import { StatCard } from '../../components/common/StatCard';
import { AppBadge } from '../../components/common/AppBadge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import {
  Briefcase,
  Users,
  DollarSign,
  Package,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';

export const ContractorDashboardScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setError(null);
    try {
      const res = await contractorService.getDashboard();
      setData(res.data?.data || null);
    } catch (err) {
      console.error('Failed to load contractor dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
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

  const formatCurrency = (amount) => {
    const val = parseFloat(amount) || 0;
    return '₹' + val.toLocaleString('en-IN');
  };

  if (isLoading) return <LoadingScreen message="Loading Contractor Workspace..." />;

  if (error && !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImpersonationBanner />
        <ErrorState title="Unable to load dashboard" description={error} onRetry={fetchDashboard} />
      </SafeAreaView>
    );
  }

  const { stats = {}, recentProjects = [], recentAttendance = [], lowStockMaterials = [] } = data || {};

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
            <Text style={styles.welcomeText}>Contractor Portal</Text>
            <Text style={styles.headline}>Executive Operations Hub</Text>
          </View>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>C</Text>
          </View>
        </View>

        {/* 4 KPI Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Active Sites"
              value={stats.activeProjects || 0}
              subtitle="Current Construction Sites"
              icon={Briefcase}
              color="gold"
            />
            <StatCard
              title="Total Workforce"
              value={stats.totalWorkers || 0}
              subtitle="Registered Field Labor"
              icon={Users}
              color="blue"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Expenses Logged"
              value={formatCurrency(stats.totalExpenses)}
              subtitle="Cumulative Project Outlay"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Inventory Items"
              value={stats.totalMaterials || 0}
              subtitle="Tracked Stock Items"
              icon={Package}
              color="purple"
            />
          </View>
        </View>

        {/* Quick Action Navigation Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('ContractorAttendance')}
          >
            <CalendarCheck size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Muster Roll</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('ContractorMaterials')}
          >
            <Package size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Materials Specs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('ContractorExpenses')}
          >
            <DollarSign size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation.navigate('ContractorProgress')}
          >
            <TrendingUp size={16} color={colors.gold700} />
            <Text style={styles.actionPillText}>Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Active Projects List */}
        <AppCard
          title="Active Construction Projects"
          subtitle="Real-time site milestones and completion"
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('ContractorProjects')}>
              <Text style={styles.cardActionText}>View All</Text>
            </TouchableOpacity>
          }
        >
          {recentProjects.length === 0 ? (
            <Text style={styles.emptyInlineText}>No active projects found.</Text>
          ) : (
            recentProjects.slice(0, 3).map((prj) => (
              <TouchableOpacity
                key={prj.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ContractorProjects', { selectedId: prj.id })}
                style={styles.projectRow}
              >
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{prj.project_name}</Text>
                  <Text style={styles.projectSub}>
                    Budget: {formatCurrency(prj.budget)} • Type: {prj.project_type || 'Residential'}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${Math.min(prj.completion_percentage || 0, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressPct}>{prj.completion_percentage || 0}%</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.neutral400} />
              </TouchableOpacity>
            ))
          )}
        </AppCard>

        {/* Today's Shift Muster Snapshot */}
        <AppCard
          title="Daily Shift Attendance Logs"
          subtitle="Recent worker check-ins and acceptance status"
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('ContractorAttendance')}>
              <Text style={styles.cardActionText}>Muster Sheet</Text>
            </TouchableOpacity>
          }
        >
          {recentAttendance.length === 0 ? (
            <Text style={styles.emptyInlineText}>No shift logs recorded today.</Text>
          ) : (
            recentAttendance.slice(0, 4).map((att) => (
              <View key={att.id} style={styles.attRow}>
                <View style={styles.attInfo}>
                  <Text style={styles.attName}>{att.worker_name || 'Worker'}</Text>
                  <Text style={styles.attSub}>
                    {att.trade || 'Worker'} • Clock: {att.clock_in ? att.clock_in.substring(11, 16) : '08:00'} - {att.clock_out ? att.clock_out.substring(11, 16) : '17:00'}
                  </Text>
                </View>
                <AppBadge
                  label={att.worker_acceptance === 'Accepted' ? 'Present' : (att.worker_acceptance || att.status || 'Awaiting')}
                  variant={att.worker_acceptance === 'Accepted' ? 'Present' : 'warning'}
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
    color: colors.gold600,
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
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
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
    gap: 6,
  },
  actionPill: {
    flex: 1,
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold800,
    textAlign: 'center',
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold600,
  },
  emptyInlineText: {
    fontSize: 12,
    color: colors.neutral400,
    textAlign: 'center',
    paddingVertical: 12,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  projectInfo: {
    flex: 1,
    marginRight: 10,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral900,
  },
  projectSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold500,
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold600,
  },
  attRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  attInfo: {
    flex: 1,
  },
  attName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  attSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
});
