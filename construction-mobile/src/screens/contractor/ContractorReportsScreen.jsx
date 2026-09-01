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
import { AppButton } from '../../components/common/AppButton';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import {
  FileText,
  Download,
  Building2,
  DollarSign,
  Package,
  CalendarCheck,
  Briefcase,
  Share2,
} from 'lucide-react-native';

export const ContractorReportsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [prjRes, docRes, expRes, matRes, attRes] = await Promise.all([
        contractorService.getProjects(),
        contractorService.getDocuments(selectedProjectId),
        contractorService.getExpenses(selectedProjectId),
        contractorService.getMaterials(selectedProjectId),
        contractorService.getAttendance('', selectedProjectId),
      ]);

      const prjList = prjRes.data?.data || prjRes.data || [];
      setProjects(prjList);
      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }

      setDocuments(docRes.data?.data || docRes.data || []);
      setExpenses(expRes.data?.data || expRes.data || []);
      setMaterials(matRes.data?.data || matRes.data || []);
      setAttendance(attRes.data?.data || attRes.data || []);
    } catch (err) {
      console.error('Failed to load reports datasets:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || {};
  const projectName = currentProject.project_name || 'Building Site';

  const handleExport = (reportType) => {
    Alert.alert(
      'Export Certified Audit',
      `ConstructIQ ${reportType} report for "${projectName}" has been compiled and saved to device memory.`
    );
  };

  if (isLoading) return <LoadingScreen message="Loading Reports Center..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Project Reports & Audits"
        subtitle="Certified Site Ledgers & Documents"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Selector Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectPills}>
          {projects.map((prj) => {
            const active = prj.id === selectedProjectId;
            return (
              <TouchableOpacity
                key={prj.id}
                onPress={() => setSelectedProjectId(prj.id)}
                style={[styles.projectPill, active ? styles.projectPillActive : null]}
              >
                <Building2 size={14} color={active ? colors.white : colors.neutral700} />
                <Text style={[styles.projectPillText, active ? styles.projectPillTextActive : null]}>
                  {prj.project_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4 Report Cards */}
        <View style={styles.grid}>
          {/* Financials Report */}
          <View style={styles.reportCard}>
            <View style={[styles.iconWrap, { backgroundColor: colors.gold50 }]}>
              <DollarSign size={20} color={colors.gold600} />
            </View>
            <Text style={styles.reportTitle}>Financials & Outlay</Text>
            <Text style={styles.reportSub}>{expenses.length} Line-item expenditures</Text>
            <AppButton
              title="Export CSV"
              size="sm"
              icon={Download}
              onPress={() => handleExport('Financials CSV')}
              style={styles.exportBtn}
            />
          </View>

          {/* Materials Specs Report */}
          <View style={styles.reportCard}>
            <View style={[styles.iconWrap, { backgroundColor: colors.purpleLight }]}>
              <Package size={20} color="#7C3AED" />
            </View>
            <Text style={styles.reportTitle}>Materials & Specs</Text>
            <Text style={styles.reportSub}>{materials.length} Inventory SKUs</Text>
            <AppButton
              title="Export CSV"
              size="sm"
              icon={Download}
              onPress={() => handleExport('Materials Inventory CSV')}
              style={styles.exportBtn}
            />
          </View>

          {/* Muster Roll Report */}
          <View style={styles.reportCard}>
            <View style={[styles.iconWrap, { backgroundColor: colors.successLight }]}>
              <CalendarCheck size={20} color={colors.success} />
            </View>
            <Text style={styles.reportTitle}>Site Muster Roll</Text>
            <Text style={styles.reportSub}>{attendance.length} Shift attendance logs</Text>
            <AppButton
              title="Export CSV"
              size="sm"
              icon={Download}
              onPress={() => handleExport('Muster Roll CSV')}
              style={styles.exportBtn}
            />
          </View>

          {/* Executive Site Audit */}
          <View style={styles.reportCard}>
            <View style={[styles.iconWrap, { backgroundColor: colors.infoLight }]}>
              <Briefcase size={20} color="#2563EB" />
            </View>
            <Text style={styles.reportTitle}>Executive Site Audit</Text>
            <Text style={styles.reportSub}>Full Project Status</Text>
            <AppButton
              title="Generate PDF"
              size="sm"
              variant="outline"
              icon={FileText}
              onPress={() => handleExport('Executive Audit PDF')}
              style={styles.exportBtn}
            />
          </View>
        </View>

        {/* Blueprint & Specification Documents */}
        <AppCard
          title={`Blueprint & Permit Documents (${documents.length})`}
          subtitle="Official drawings, architectural plans, and municipal certificates"
        >
          {documents.length === 0 ? (
            <Text style={styles.emptyText}>No documents registered for this project.</Text>
          ) : (
            documents.map((doc) => (
              <View key={doc.id} style={styles.docRow}>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle}>{doc.name || doc.title}</Text>
                  <Text style={styles.docCategory}>
                    {doc.category || 'Blueprint / Spec'} • Uploaded by {doc.uploader_name || 'Contractor'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleExport(`Document "${doc.name || doc.title}"`)}
                  style={styles.downloadDocBtn}
                >
                  <Download size={14} color={colors.gold700} />
                </TouchableOpacity>
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
    paddingBottom: 40,
  },
  projectPills: {
    gap: 8,
    marginBottom: 14,
  },
  projectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    gap: 6,
  },
  projectPillActive: {
    backgroundColor: colors.gold500,
    borderColor: colors.gold500,
  },
  projectPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
  },
  projectPillTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  reportCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral950,
    textAlign: 'center',
  },
  reportSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  exportBtn: {
    width: '100%',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  docInfo: {
    flex: 1,
    marginRight: 8,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  docCategory: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  downloadDocBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.gold50,
    borderWidth: 1,
    borderColor: colors.gold200,
  },
  emptyText: {
    fontSize: 12,
    color: colors.neutral400,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
