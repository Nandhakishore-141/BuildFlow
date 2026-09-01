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
import { AppBadge } from '../../components/common/AppBadge';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppModal } from '../../components/common/AppModal';
import { FAB } from '../../components/common/FAB';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as homeownerService from '../../services/homeownerService';
import * as projectService from '../../services/projectService';
import { Building2, MapPin, DollarSign, Plus, User, ShieldCheck } from 'lucide-react-native';

export const HomeownerBuildingsScreen = ({ navigation }) => {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
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

  const fetchBuildings = useCallback(async () => {
    try {
      const res = await homeownerService.getBuildings();
      setBuildings(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load homeowner buildings:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBuildings();
  };

  const handleCreateBuilding = async () => {
    if (!form.project_name || !form.budget) {
      Alert.alert('Required Fields', 'Please enter property name and target budget.');
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
      fetchBuildings();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to post property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Properties..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="My Properties & Sites"
        subtitle={`${buildings.length} Registered Buildings`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="+ Post Site"
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
        {buildings.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Properties Registered"
            description="Post your building plot or residential project to start receiving contractor bids."
            actionTitle="+ Register Property"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          buildings.map((b) => (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.title}>{b.project_name}</Text>
                  <Text style={styles.code}>{b.project_code || 'PROP-01'} • {b.project_type || 'Villa'}</Text>
                </View>
                <AppBadge label={b.status || 'In Progress'} variant={b.status === 'Completed' ? 'Completed' : 'In Progress'} />
              </View>

              {b.description ? (
                <Text style={styles.desc} numberOfLines={2}>{b.description}</Text>
              ) : null}

              <View style={styles.kpiRow}>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLbl}>Target Budget</Text>
                  <Text style={styles.kpiVal}>{formatCurrency(b.budget)}</Text>
                </View>
                <View style={styles.kpiCol}>
                  <Text style={styles.kpiLbl}>Contractor</Text>
                  <Text style={styles.kpiVal}>{b.contractor_name || 'Pending Assignment'}</Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${Math.min(b.completion_percentage || 0, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>{b.completion_percentage || 0}%</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setIsModalOpen(true)} />

      {/* Post Property Modal */}
      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Construction Plot"
        subtitle="Post project for vetted contractors"
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setIsModalOpen(false)} />
            <AppButton title="Post Site" size="sm" onPress={handleCreateBuilding} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Property / Villa Name *"
          value={form.project_name}
          onChangeText={(v) => setForm({ ...form, project_name: v })}
          placeholder="e.g. Greenwood Duplex Villa"
        />

        <AppInput
          label="Property Type"
          value={form.project_type}
          onChangeText={(v) => setForm({ ...form, project_type: v })}
          placeholder="Villa, Bungalow, Apartment, Commercial"
        />

        <AppInput
          label="Estimated Budget (INR ₹) *"
          value={form.budget}
          onChangeText={(v) => setForm({ ...form, budget: v })}
          placeholder="e.g. 45000000"
          keyboardType="numeric"
        />

        <AppInput
          label="Plot Address / Location"
          value={form.address}
          onChangeText={(v) => setForm({ ...form, address: v })}
          placeholder="e.g. Plot 12, Whitefield"
        />

        <AppInput
          label="Architectural Goals & Scope"
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          placeholder="Planned 4BHK with swimming pool, terrace garden, and solar backup."
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
    paddingBottom: 80,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 14,
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
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral950,
  },
  code: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 6,
    lineHeight: 16,
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
    marginTop: 10,
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
});
