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
import {
  Package,
  Plus,
  Building2,
  Trash2,
  Edit2,
  DollarSign,
  Truck,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';

const CATEGORIES = ['All', 'Structural', 'Masonry', 'Plumbing', 'Electrical', 'Finishing', 'Safety'];

export const ContractorMaterialsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State for New/Edit Material
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Structural',
    specifications: '',
    quantity: '',
    unit: 'Bags',
    cost_per_unit: '',
    supplier: '',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [prjRes, matRes] = await Promise.all([
        contractorService.getProjects(),
        contractorService.getMaterials(selectedProjectId),
      ]);

      const prjList = prjRes.data?.data || prjRes.data || [];
      setProjects(prjList);
      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }

      setMaterials(matRes.data?.data || matRes.data || []);
    } catch (err) {
      console.error('Failed to load materials:', err);
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
    setIsEditingId(null);
    setForm({
      name: '',
      category: 'Structural',
      specifications: '',
      quantity: '',
      unit: 'Bags',
      cost_per_unit: '',
      supplier: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSaveMaterial = async () => {
    if (!form.name || !form.quantity || !selectedProjectId) {
      Alert.alert('Required Fields', 'Please enter material name, quantity, and select project.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        project_id: selectedProjectId,
        name: form.name,
        category: form.category,
        specifications: form.specifications,
        quantity: parseFloat(form.quantity) || 0,
        unit: form.unit,
        cost_per_unit: parseFloat(form.cost_per_unit) || 0,
        supplier: form.supplier,
        notes: form.notes,
        status: 'Available',
      };

      if (isEditingId) {
        await contractorService.updateMaterial(isEditingId, payload);
      } else {
        await contractorService.createMaterial(payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = (id, name) => {
    Alert.alert(
      'Delete Material',
      `Are you sure you want to remove "${name}" from stock inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await contractorService.deleteMaterial(id);
              fetchData();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete material item.');
            }
          },
        },
      ]
    );
  };

  const filteredMaterials = materials.filter(
    (m) => selectedCategory === 'All' || m.category === selectedCategory
  );

  const formatCurrency = (val) => '₹' + (parseFloat(val) || 0).toLocaleString('en-IN');

  if (isLoading) return <LoadingScreen message="Loading Material Inventory..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Material Specs & Stock"
        subtitle={`${materials.length} Tracked Procurement Items`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <AppButton
            title="+ New Item"
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
          {CATEGORIES.map((cat) => (
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

        {/* Materials List */}
        {filteredMaterials.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Material Items Found"
            description="Add structural, electrical, or finishing materials using the + New Item button."
            actionTitle="+ Create Material"
            onAction={handleOpenAddModal}
          />
        ) : (
          filteredMaterials.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.itemTitleWrap}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category || 'Structural'} • {item.supplier || 'Site Vendor'}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => handleDeleteMaterial(item.id, item.name)}
                    style={styles.actionIconBtn}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              {item.specifications ? (
                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>Specifications / Grade:</Text>
                  <Text style={styles.specValue}>{item.specifications}</Text>
                </View>
              ) : null}

              <View style={styles.itemFooter}>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyVal}>{item.quantity} {item.unit || 'Units'}</Text>
                </View>
                <Text style={styles.costVal}>
                  {formatCurrency(item.cost_per_unit || item.estimated_cost)} / {item.unit || 'Unit'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB onPress={handleOpenAddModal} />

      {/* Add / Edit Material Modal */}
      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditingId ? 'Edit Material Specifications' : 'Add Material with Specifications'}
        subtitle="Log procurement grade, quantity, and unit cost"
        footer={
          <>
            <AppButton title="Cancel" variant="outline" size="sm" onPress={() => setIsModalOpen(false)} />
            <AppButton title="Save Material" size="sm" onPress={handleSaveMaterial} isLoading={isSubmitting} />
          </>
        }
      >
        <AppInput
          label="Material Item Name *"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          placeholder="e.g. UltraTech Cement Grade 53"
        />

        <AppInput
          label="Category"
          value={form.category}
          onChangeText={(v) => setForm({ ...form, category: v })}
          placeholder="Structural, Masonry, Plumbing, etc."
        />

        <AppInput
          label="Technical Specifications & Grade"
          value={form.specifications}
          onChangeText={(v) => setForm({ ...form, specifications: v })}
          placeholder="e.g. OPC 53 Grade, IS 12269, Fe500D TMT Bar"
          multiline
          numberOfLines={2}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <AppInput
              label="Quantity *"
              value={form.quantity}
              onChangeText={(v) => setForm({ ...form, quantity: v })}
              placeholder="e.g. 500"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppInput
              label="Unit"
              value={form.unit}
              onChangeText={(v) => setForm({ ...form, unit: v })}
              placeholder="Bags, Tons, Units"
            />
          </View>
        </View>

        <AppInput
          label="Unit Cost (INR ₹)"
          value={form.cost_per_unit}
          onChangeText={(v) => setForm({ ...form, cost_per_unit: v })}
          placeholder="e.g. 420"
          keyboardType="numeric"
        />

        <AppInput
          label="Vendor / Supplier Name"
          value={form.supplier}
          onChangeText={(v) => setForm({ ...form, supplier: v })}
          placeholder="e.g. Bangalore Steel & Cement Depot"
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
  itemCard: {
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
  itemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemTitleWrap: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral950,
  },
  itemCategory: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.neutral100,
  },
  specBox: {
    backgroundColor: colors.gold50,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.gold100,
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold800,
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 12,
    color: colors.neutral800,
    marginTop: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  qtyBadge: {
    backgroundColor: colors.purpleLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qtyVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B21A8',
  },
  costVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral900,
  },
});
