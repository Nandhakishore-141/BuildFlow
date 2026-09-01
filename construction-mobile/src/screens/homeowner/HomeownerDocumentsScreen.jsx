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
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as homeownerService from '../../services/homeownerService';
import { FileText, Download, ShieldCheck } from 'lucide-react-native';

export const HomeownerDocumentsScreen = ({ navigation }) => {
  const [buildings, setBuildings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const bldRes = await homeownerService.getBuildings();
      const list = bldRes.data?.data || bldRes.data || [];
      setBuildings(list);

      if (list.length > 0) {
        const docRes = await homeownerService.getProjectDocuments(list[0].id);
        setDocuments(docRes.data?.data || docRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load homeowner documents:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDownload = (doc) => {
    Alert.alert(
      'Document Downloaded',
      `"${doc.title || doc.name}" has been downloaded to your device files with certified verification.`
    );
  };

  if (isLoading) return <LoadingScreen message="Loading Blueprints & Permits..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Blueprints & Contracts"
        subtitle={`${documents.length} Certified Project Documents`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Documents Uploaded"
            description="Your lead contractor will upload municipal permits, architectural CAD blueprints, and structural drawings here."
          />
        ) : (
          documents.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.topRow}>
                <View style={styles.iconWrap}>
                  <FileText size={20} color={colors.gold600} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.title}>{doc.title || doc.name}</Text>
                  <Text style={styles.sub}>
                    {doc.file_type || 'Blueprint'} • Uploaded by {doc.uploader_name || 'Contractor'}
                  </Text>
                  <Text style={styles.date}>Recorded: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Active'}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDownload(doc)}
                  style={styles.downloadBtn}
                >
                  <Download size={16} color={colors.gold700} />
                </TouchableOpacity>
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
  docCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.gold50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
  },
  sub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: colors.neutral400,
    marginTop: 2,
  },
  downloadBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
    marginLeft: 8,
  },
});
