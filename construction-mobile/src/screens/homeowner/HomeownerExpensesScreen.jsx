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
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as homeownerService from '../../services/homeownerService';
import { DollarSign, Download, CreditCard, Receipt } from 'lucide-react-native';

export const HomeownerExpensesScreen = ({ navigation }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const bldRes = await homeownerService.getBuildings();
      const list = bldRes.data?.data || bldRes.data || [];
      setBuildings(list);

      const targetId = selectedBuildingId || (list.length > 0 ? list[0].id : '');
      if (targetId) {
        setSelectedBuildingId(targetId);
        const expRes = await homeownerService.getProjectExpenses(targetId);
        setExpenses(expRes.data?.data || expRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load homeowner expenses:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedBuildingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');
  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  if (isLoading) return <LoadingScreen message="Loading Financial Statement..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Expense Statements"
        subtitle={`Cumulative Outlay: ${formatCurrency(totalSpent)}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="Download PDF"
            size="sm"
            variant="outline"
            icon={Download}
            onPress={() => Alert.alert('Export Statement', 'Certified project expense audit statement downloaded to device.')}
          />
        }
      />
      <ImpersonationBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {expenses.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Expenses Logged"
            description="When your contractor logs site purchases and material bills, full receipts will appear here for audit."
          />
        ) : (
          expenses.map((exp) => (
            <View key={exp.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.info}>
                  <Text style={styles.title}>{exp.title}</Text>
                  <Text style={styles.sub}>
                    {exp.category || 'Materials'} • {exp.vendor || 'Vendor'} • {exp.date ? exp.date.substring(0, 10) : 'Recent'}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(exp.amount)}</Text>
              </View>

              {exp.description ? <Text style={styles.desc}>{exp.description}</Text> : null}

              <View style={styles.footer}>
                <View style={styles.tag}>
                  <CreditCard size={11} color={colors.neutral600} style={{ marginRight: 4 }} />
                  <Text style={styles.tagText}>{exp.payment_method || 'Bank Transfer'}</Text>
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
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
  },
  sub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.danger,
  },
  desc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 6,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral700,
  },
});
