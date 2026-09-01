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
import { FAB } from '../../components/common/FAB';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import * as projectService from '../../services/projectService';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

export const ContractorProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New Project Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    project_name: '',
    project_type: 'Villa',
    budget: '',
    address: '',
    city: 'Bangalore',
    description: '',
  });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await contractorService.getProjects();
      setProjects(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load contractor projects:', err);
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

  const handleCreateProject = async () => {
    if (!form.project_name || !form.budget) {
      Alert.alert('Required Fields', 'Please enter project name and budget.');
      return;
    }

    setIsSubmitting(true);
    try {
      await projectService.createProject({
        project_name: form.project_name,
        project_type: form.project_type,
        budget: parseFloat(form.budget) || 0,
        address: form.address,
        city: form.city,
        description: form.description,
        status: 'In Progress',
      });

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Projects Portfolio..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Building Projects"
        subtitle={`${projects.length} Active Sites`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="+ New Site"
            size="sm"
            onPress={() => setIsModalOpen(true)}
          />
        }
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {projects.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Building Sites Found"
            description="Create a new construction project to start tracking teams, tasks, and budgets."
            actionTitle="+ Create Project"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          projects.map((prj) => (
            <View key={prj.id} style={styles.projectCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.prjName}>{prj.project_name}</Text>
                  <Text style={styles.prjCode}>{prj.project_code || 'PRJ-01'} • {prj.project_type || 'Residential'}</Text>
                </View>
                <AppBadge
                  label={prj.status || 'In Progress'}
                  variant={prj.status === 'Completed' ? 'Completed' : 'In Progress'}
                />
              </View>

              {prj.description ? (
                <Text style={styles.prjDesc} numberOfLines={2}>{prj.description}</Text>
              ) : null}

              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Budget</Text>
                  <Text style={styles.metaVal}>{formatCurrency(prj.budget)}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>City</Text>
                  <Text style={styles.metaVal}>{prj.city || 'Bangalore'}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Completion</Text>
                  <Text style={[styles.metaVal, { color: colors.gold600 }]}>{prj.completion_percentage || 0}%</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(prj.completion_percentage || 0, 100)}%` },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setIsModalOpen(true)} />

      {/* New Project Modal */}
      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Construction Site"
        subtitle="Set up project budget and specifications"
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setIsModalOpen(false)} />
            <AppButton title="Create Site" size="sm" onPress={handleCreateProject} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Project Name *"
          value={form.project_name}
          onChangeText={(v) => setForm({ ...form, project_name: v })}
          placeholder="e.g. Palm Springs Residences"
        />

        <AppInput
          label="Structure Type"
          value={form.project_type}
          onChangeText={(v) => setForm({ ...form, project_type: v })}
          placeholder="Villa, Commercial, Gated Community, Apartment"
        />

        <AppInput
          label="Total Planned Budget (INR ₹) *"
          value={form.budget}
          onChangeText={(v) => setForm({ ...form, budget: v })}
          placeholder="e.g. 50000000"
          keyboardType="numeric"
        />

        <AppInput
          label="Site Location / Address"
          value={form.address}
          onChangeText={(v) => setForm({ ...form, address: v })}
          placeholder="e.g. Plot 14, Outer Ring Road"
        />

        <AppInput
          label="Project Scope & Remarks"
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          placeholder="Architectural overview and milestones"
          multiline
          numberOfLines={2}
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
    paddingBottom: 80,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  prjName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral950,
  },
  prjCode: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  prjDesc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 8,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.neutral50,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral400,
    textTransform: 'uppercase',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.neutral800,
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral200,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold500,
    borderRadius: 3,
  },
});
