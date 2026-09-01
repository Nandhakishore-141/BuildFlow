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
import { AppHeader } from '../../components/common/AppHeader';
import { AppBadge } from '../../components/common/AppBadge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as projectService from '../../services/projectService';
import { Building2, MapPin, ChevronRight, HardHat } from 'lucide-react-native';

export const WorkerBuildingsScreen = ({ navigation }) => {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBuildings = useCallback(async () => {
    try {
      const res = await projectService.getProjects({ limit: 20 });
      const raw = res.data?.data?.data || res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      setBuildings(list);
    } catch (err) {
      console.error('Failed to load worker assigned buildings:', err);
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

  if (isLoading) return <LoadingScreen message="Loading Assigned Buildings..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="My Assigned Buildings"
        subtitle={`${buildings.length} Active Construction Sites`}
        showBack
        onBack={() => navigation.goBack()}
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
            title="No Building Sites Assigned"
            description="When a contractor assigns you to a project team, the site will appear here."
          />
        ) : (
          buildings.map((b) => (
            <View key={b.id} style={styles.buildingCard}>
              <View style={styles.cardTop}>
                <View style={styles.infoWrap}>
                  <Text style={styles.name}>{b.project_name}</Text>
                  <Text style={styles.code}>{b.project_code || 'SITE-01'} • {b.project_type || 'Villa'}</Text>
                </View>
                <AppBadge label={b.status || 'In Progress'} variant={b.status === 'Completed' ? 'Completed' : 'In Progress'} />
              </View>

              {b.description ? (
                <Text style={styles.desc} numberOfLines={2}>{b.description}</Text>
              ) : null}

              <View style={styles.locRow}>
                <MapPin size={12} color={colors.neutral500} style={{ marginRight: 4 }} />
                <Text style={styles.locText}>{b.address || 'Bangalore, Karnataka'}</Text>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${Math.min(b.completion_percentage || 0, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>{b.completion_percentage || 0}% Done</Text>
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
  buildingCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoWrap: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
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
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locText: {
    fontSize: 11,
    color: colors.neutral500,
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
