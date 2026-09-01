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
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as homeownerService from '../../services/homeownerService';
import {
  Building2,
  DollarSign,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  MapPin,
  ChevronRight,
  FileText,
} from 'lucide-react-native';

export const HomeownerDashboardScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, bldRes] = await Promise.all([
        homeownerService.getDashboard(),
        homeownerService.getBuildings(),
      ]);

      const dashData = dashRes.data?.data || dashRes.data || {};
      const buildings = bldRes.data?.data || bldRes.data || [];
      setData({ ...dashData, buildings });
    } catch (err) {
      console.error('Failed to load homeowner dashboard:', err);
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

  if (isLoading) return <LoadingScreen message="Loading Homeowner Portal..." />;

  const { stats = {}, buildings = [], recentMilestones = [] } = data || {};
  const activeBuilding = buildings[0];

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
            <Text style={styles.welcomeText}>Property Owner Workspace</Text>
            <Text style={styles.headline}>Site Overview & Milestones</Text>
          </View>
          <View style={[styles.brandIcon, { backgroundColor: '#2563EB' }]}>
            <Building2 size={22} color={colors.white} />
          </View>
        </View>

        {/* 4 KPIs */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="My Properties"
              value={buildings.length}
              subtitle="Registered Real Estate"
              icon={Building2}
              color="blue"
            />
            <StatCard
              title="Capital Budget"
              value={formatCurrency(activeBuilding?.budget || 45000000)}
              subtitle="Planned Project Budget"
              icon={DollarSign}
              color="emerald"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Completion %"
              value={`${activeBuilding?.completion_percentage || 65}%`}
              subtitle="Live Site Milestones"
              icon={TrendingUp}
              color="gold"
            />
            <StatCard
              title="Verified Lead"
              value={activeBuilding?.contractor_name || 'Alex Turner'}
              subtitle={activeBuilding?.contractor_company || 'ABC Constructions'}
              icon={ShieldCheck}
              color="purple"
            />
          </View>
        </View>

        {/* Primary Building Card */}
        {activeBuilding ? (
          <AppCard
            title="Live Construction Workspace"
            subtitle={activeBuilding.project_code || 'SITE-01'}
            rightAction={
              <AppBadge label={activeBuilding.status || 'In Progress'} variant="In Progress" />
            }
          >
            <Text style={styles.buildingTitle}>{activeBuilding.project_name}</Text>
            <Text style={styles.buildingDesc} numberOfLines={2}>{activeBuilding.description}</Text>

            <View style={styles.kpiBox}>
              <View style={styles.kpiCol}>
                <Text style={styles.kpiLbl}>Lead Contractor</Text>
                <Text style={styles.kpiVal}>{activeBuilding.contractor_name || 'Alex Turner'}</Text>
              </View>
              <View style={styles.kpiCol}>
                <Text style={styles.kpiLbl}>Location</Text>
                <Text style={styles.kpiVal}>{activeBuilding.city || 'Bangalore'}</Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(activeBuilding.completion_percentage || 65, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{activeBuilding.completion_percentage || 65}%</Text>
            </View>
          </AppCard>
        ) : null}

        {/* Quick Hub Navigation */}
        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('HomeownerVerifiedContractors')}
          >
            <ShieldCheck size={20} color={colors.gold600} />
            <Text style={styles.navTitle}>Verified Contractors</Text>
            <Text style={styles.navSub}>Browse vetted builders & send invites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('HomeownerExpenses')}
          >
            <DollarSign size={20} color={colors.gold600} />
            <Text style={styles.navTitle}>Expense Statements</Text>
            <Text style={styles.navSub}>Audit invoices and site expenditures</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('HomeownerDocuments')}
          >
            <FileText size={20} color={colors.gold600} />
            <Text style={styles.navTitle}>Blueprints & Permits</Text>
            <Text style={styles.navSub}>Access official architectural drawings</Text>
          </TouchableOpacity>
        </View>
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
    color: '#2563EB',
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
  buildingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral950,
  },
  buildingDesc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 4,
    lineHeight: 16,
  },
  kpiBox: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  kpiCol: {
    flex: 1,
  },
  kpiLbl: {
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold500,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold600,
  },
  quickNav: {
    gap: 10,
    marginTop: 4,
  },
  navCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 16,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
    marginTop: 6,
  },
  navSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
});
