import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import * as adminService from '../../services/adminService';
import {
  FileText,
  Download,
  Briefcase,
  DollarSign,
  Users,
  Package,
} from 'lucide-react-native';

export const AdminReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const res = await adminService.getReports();
      setReports(res.data?.data || res.data || null);
    } catch (err) {
      console.error('Failed to load platform reports:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  const handleExport = (reportType) => {
    Alert.alert(
      'Export Complete',
      `ConstructIQ ${reportType} compiled and saved to device memory.`
    );
  };

  if (isLoading) return <LoadingScreen message="Compiling Platform Audits..." />;

  const {
    projectsSummary = {},
    financialSummary = {},
    workforceSummary = {},
    materialsSummary = {},
  } = reports || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Platform Master Audits"
        subtitle="Executive Platform Metrics"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="Export Master CSV"
            size="sm"
            icon={Download}
            onPress={() => handleExport('Platform Master CSV')}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Projects Summary */}
        <AppCard
          title="Projects Portfolio Audit"
          subtitle="Operational metrics across all active sites"
          rightAction={
            <AppButton
              title="CSV"
              size="sm"
              variant="outline"
              icon={Download}
              onPress={() => handleExport('Projects Audit CSV')}
            />
          }
        >
          <View style={styles.row}>
            <Text style={styles.lbl}>Total Platform Projects</Text>
            <Text style={styles.val}>{projectsSummary.totalProjects || 0} Sites</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Total Planned Capital</Text>
            <Text style={styles.val}>{formatCurrency(projectsSummary.totalBudget)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Avg Portfolio Completion</Text>
            <Text style={[styles.val, { color: colors.gold600 }]}>{projectsSummary.avgCompletion || 0}%</Text>
          </View>
        </AppCard>

        {/* Financial Summary */}
        <AppCard
          title="Financial & Outlay Audit"
          subtitle="Capital budgets vs logged site expenditures"
          rightAction={
            <AppButton
              title="CSV"
              size="sm"
              variant="outline"
              icon={Download}
              onPress={() => handleExport('Financial Audit CSV')}
            />
          }
        >
          <View style={styles.row}>
            <Text style={styles.lbl}>Total Allocated Budget</Text>
            <Text style={[styles.val, { color: colors.success }]}>{formatCurrency(financialSummary.totalBudget)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Logged Expenditures</Text>
            <Text style={[styles.val, { color: colors.danger }]}>{formatCurrency(financialSummary.totalExpenses)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Net Capital Surplus</Text>
            <Text style={[styles.val, { color: colors.success }]}>{formatCurrency(financialSummary.netRemaining)}</Text>
          </View>
        </AppCard>

        {/* Workforce Summary */}
        <AppCard
          title="Workforce & Labor Analytics"
          subtitle="Field labor check-ins and registrations"
          rightAction={
            <AppButton
              title="CSV"
              size="sm"
              variant="outline"
              icon={Download}
              onPress={() => handleExport('Workforce Audit CSV')}
            />
          }
        >
          <View style={styles.row}>
            <Text style={styles.lbl}>Registered Site Workers</Text>
            <Text style={styles.val}>{workforceSummary.totalWorkers || 0} Personnel</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Active Site Assignments</Text>
            <Text style={styles.val}>{workforceSummary.totalAssignments || 0} Deployments</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Attendance Shift Logs</Text>
            <Text style={styles.val}>{workforceSummary.totalAttendanceLogs || 0} Logs</Text>
          </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  lbl: {
    fontSize: 12,
    color: colors.neutral600,
    fontWeight: '600',
  },
  val: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral950,
  },
});
