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
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppModal } from '../../components/common/AppModal';
import { FAB } from '../../components/common/FAB';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { ImpersonationBanner } from '../../components/common/ImpersonationBanner';
import * as contractorService from '../../services/contractorService';
import {
  DollarSign,
  Plus,
  Building2,
  Trash2,
  Receipt,
  CreditCard,
  Tag,
} from 'lucide-react-native';

const EXPENSE_CATEGORIES = ['All', 'Materials', 'Labor', 'Equipment', 'Permits', 'Logistics', 'Other'];

export const ContractorExpensesScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Materials',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    payment_method: 'Bank Transfer',
    description: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [prjRes, expRes] = await Promise.all([
        contractorService.getProjects(),
        contractorService.getExpenses(selectedProjectId),
      ]);

      const prjList = prjRes.data?.data || prjRes.data || [];
      setProjects(prjList);
      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }

      setExpenses(expRes.data?.data || expRes.data || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
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

  const handleOpenAddModal = () => {
    setForm({
      title: '',
      category: 'Materials',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      payment_method: 'Bank Transfer',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleSaveExpense = async () => {
    if (!form.title || !form.amount || !selectedProjectId) {
      Alert.alert('Required Fields', 'Please enter expense title, amount, and select project.');
      return;
    }

    setIsSubmitting(true);
    try {
      await contractorService.createExpense({
        project_id: selectedProjectId,
        title: form.title,
        category: form.category,
        amount: parseFloat(form.amount) || 0,
        date: form.date,
        vendor: form.vendor,
        payment_method: form.payment_method,
        description: form.description,
      });

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to log expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = (id, title) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to remove "${title}" from project ledger?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await contractorService.deleteExpense(id);
              fetchData();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete expense record.');
            }
          },
        },
      ]
    );
  };

  const filteredExpenses = expenses.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  const totalExpenseSum = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Expenses Ledger..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Expenses & Outlay"
        subtitle={`Total Logged: ${formatCurrency(totalExpenseSum)}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="+ Add Expense"
            size="sm"
            onPress={handleOpenAddModal}
          />
        }
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

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {EXPENSE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catPill, selectedCategory === cat ? styles.catPillActive : null]}
            >
              <Text style={[styles.catText, selectedCategory === cat ? styles.catTextActive : null]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Expense Line Items */}
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Expenses Logged"
            description="Log site purchases, vendor bills, or contractor payments with the + Add Expense button."
            actionTitle="+ Create Expense"
            onAction={handleOpenAddModal}
          />
        ) : (
          filteredExpenses.map((exp) => (
            <View key={exp.id} style={styles.expCard}>
              <View style={styles.expTop}>
                <View style={styles.expInfo}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expSub}>
                    {exp.category || 'Materials'} • {exp.vendor || 'Vendor'} • {exp.date ? exp.date.substring(0, 10) : 'Today'}
                  </Text>
                </View>
                <View style={styles.expRight}>
                  <Text style={styles.expAmount}>{formatCurrency(exp.amount)}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(exp.id, exp.title)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={14} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              {exp.description ? (
                <Text style={styles.expDesc}>{exp.description}</Text>
              ) : null}

              <View style={styles.expFooter}>
                <View style={styles.methodTag}>
                  <CreditCard size={11} color={colors.neutral600} style={{ marginRight: 4 }} />
                  <Text style={styles.methodText}>{exp.payment_method || 'Bank Transfer'}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB onPress={handleOpenAddModal} />

      {/* Add Expense Modal */}
      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Project Expense"
        subtitle="Record line-item cost and payment reference"
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setIsModalOpen(false)} />
            <AppButton title="Save Expense" size="sm" onPress={handleSaveExpense} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Expense Title *"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="e.g. Concrete Mixer Rental & Fuel"
        />

        <AppInput
          label="Category"
          value={form.category}
          onChangeText={(v) => setForm({ ...form, category: v })}
          placeholder="Materials, Labor, Equipment, Permits, etc."
        />

        <AppInput
          label="Amount (INR ₹) *"
          value={form.amount}
          onChangeText={(v) => setForm({ ...form, amount: v })}
          placeholder="e.g. 24500"
          keyboardType="numeric"
        />

        <AppInput
          label="Vendor / Payee Name"
          value={form.vendor}
          onChangeText={(v) => setForm({ ...form, vendor: v })}
          placeholder="e.g. Heavy Equipment Rentals Co."
        />

        <AppInput
          label="Payment Method"
          value={form.payment_method}
          onChangeText={(v) => setForm({ ...form, payment_method: v })}
          placeholder="Bank Transfer, UPI, Cash, Cheque"
        />

        <AppInput
          label="Expense Notes / Reference"
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          placeholder="Invoice # or payment remarks"
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
  projectPills: {
    gap: 8,
    marginBottom: 12,
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
  categoryRow: {
    gap: 6,
    marginBottom: 14,
  },
  catPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.neutral100,
  },
  catPillActive: {
    backgroundColor: colors.neutral900,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral600,
  },
  catTextActive: {
    color: colors.white,
  },
  expCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  expTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  expInfo: {
    flex: 1,
    marginRight: 10,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
  },
  expSub: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  expRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  expAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.danger,
  },
  deleteBtn: {
    padding: 4,
  },
  expDesc: {
    fontSize: 12,
    color: colors.neutral600,
    marginTop: 6,
    fontStyle: 'italic',
  },
  expFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  methodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral700,
  },
});
