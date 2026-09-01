import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AppHeader } from '../../components/common/AppHeader';
import { AppBadge } from '../../components/common/AppBadge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import * as adminService from '../../services/adminService';
import { Briefcase, DollarSign, Building2 } from 'lucide-react-native';

export const AdminProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await adminService.getProjects();
      setProjects(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load admin projects:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Platform Projects..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Platform Projects Portfolio"
        subtitle={`${projects.length} Total Construction Sites`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {projects.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Projects Found"
            description="All active and completed building projects on ConstructIQ will appear here."
          />
        ) : (
          projects.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.info}>
                  <Text style={styles.title}>{p.project_name}</Text>
                  <Text style={styles.sub}>{p.project_code || 'SITE-01'} • {p.project_type || 'Residential'}</Text>
                </View>
                <AppBadge label={p.status || 'In Progress'} variant={p.status === 'Completed' ? 'Completed' : 'In Progress'} />
              </View>

              <View style={styles.kpiRow}>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLbl}>Budget</Text>
                  <Text style={styles.kpiVal}>{formatCurrency(p.budget)}</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLbl}>City</Text>
                  <Text style={styles.kpiVal}>{p.city || 'Bangalore'}</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLbl}>Progress</Text>
                  <Text style={[styles.kpiVal, { color: colors.gold600 }]}>{p.completion_percentage || 0}%</Text>
                </View>
              </View>
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
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  info: {
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
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  kpiCol: {
    flex: 1,
    alignItems: 'center',
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
});
