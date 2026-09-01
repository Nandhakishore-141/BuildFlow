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
import { AppCard } from '../../components/common/AppCard';
import { StatCard } from '../../components/common/StatCard';
import { AppBadge } from '../../components/common/AppBadge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import * as adminService from '../../services/adminService';
import {
  ShieldCheck,
  Users,
  Briefcase,
  DollarSign,
  Activity,
  FileText,
  Building2,
  ChevronRight,
} from 'lucide-react-native';

export const AdminDashboardScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await adminService.getDashboard();
      setData(res.data?.data || res.data || {});
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
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

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Platform Administration..." />;

  const { stats = {}, recentUsers = [], recentProjects = [] } = data || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>Executive Control Center</Text>
            <Text style={styles.headline}>Platform Administration</Text>
          </View>
          <View style={[styles.brandIcon, { backgroundColor: '#7C3AED' }]}>
            <ShieldCheck size={22} color={colors.white} />
          </View>
        </View>

        {/* 4 Master Platform KPIs */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Registered Users"
              value={stats.totalUsers || 0}
              subtitle="All Platform Entities"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Active Sites"
              value={stats.totalProjects || 0}
              subtitle="Live Construction Sites"
              icon={Briefcase}
              color="gold"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Capital Monitored"
              value={formatCurrency(stats.totalBudget || 45000000)}
              subtitle="Cumulative Project Budgets"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Platform Health"
              value="100% Operational"
              subtitle="All Endpoints Healthy"
              icon={Activity}
              color="blue"
            />
          </View>
        </View>

        {/* Quick Nav Bar */}
        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Users size={16} color={colors.gold700} />
            <Text style={styles.navBtnText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate('AdminProjects')}
          >
            <Briefcase size={16} color={colors.gold700} />
            <Text style={styles.navBtnText}>All Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate('AdminReports')}
          >
            <FileText size={16} color={colors.gold700} />
            <Text style={styles.navBtnText}>Master Audits</Text>
          </TouchableOpacity>
        </View>

        {/* Users Management Preview */}
        <AppCard
          title="Recent Platform Registrations"
          subtitle="Contractors, Homeowners & Workers"
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('AdminUsers')}>
              <Text style={styles.cardActionText}>View All Users</Text>
            </TouchableOpacity>
          }
        >
          {recentUsers.length === 0 ? (
            <Text style={styles.emptyText}>No recent registrations.</Text>
          ) : (
            recentUsers.slice(0, 4).map((u) => (
              <View key={u.id} style={styles.userRow}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email} • {u.company_name || u.role}</Text>
                </View>
                <AppBadge
                  label={u.role}
                  variant={u.role === 'Contractor' ? 'gold' : u.role === 'Worker' ? 'Present' : 'Blue'}
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
    color: '#7C3AED',
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
  statsGrid: {
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  navBtn: {
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
  navBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral800,
  },
  cardActionText: {
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  userEmail: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 1,
  },
});
