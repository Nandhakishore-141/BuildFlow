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
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuthStore } from '../../store/authStore';
import * as adminService from '../../services/adminService';
import { Users, ShieldCheck, UserCheck, Trash2, KeyRound } from 'lucide-react-native';

const ROLE_TABS = ['All', 'Contractor', 'Homeowner', 'Worker'];

export const AdminUsersScreen = ({ navigation }) => {
  const { impersonateUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminService.getUsers({ role: selectedRole !== 'All' ? selectedRole : undefined });
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load platform users:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleImpersonate = (targetUser) => {
    Alert.alert(
      'Enter Impersonation Mode',
      `You will enter the application as ${targetUser.name} (${targetUser.role}). You can return to Admin at any time via the top banner.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Impersonate',
          onPress: async () => {
            try {
              await impersonateUser(targetUser.id);
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to enter impersonation mode.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <LoadingScreen message="Loading Platform Users..." />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="User Accounts & Roles"
        subtitle={`${users.length} Registered Accounts`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Tabs */}
        <View style={styles.roleTabs}>
          {ROLE_TABS.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setSelectedRole(r)}
              style={[styles.roleTab, selectedRole === r ? styles.roleTabActive : null]}
            >
              <Text style={[styles.roleTabText, selectedRole === r ? styles.roleTabTextActive : null]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="No registered user accounts found for this role filter."
          />
        ) : (
          users.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.cardTop}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                  <Text style={styles.userCompany}>{u.company_name || u.phone || u.role}</Text>
                </View>
                <AppBadge
                  label={u.role}
                  variant={u.role === 'Contractor' ? 'gold' : u.role === 'Worker' ? 'Present' : 'Blue'}
                />
              </View>

              <View style={styles.cardActions}>
                <AppButton
                  title="Impersonate User"
                  variant="outline"
                  size="sm"
                  icon={KeyRound}
                  onPress={() => handleImpersonate(u)}
                  style={{ flex: 1 }}
                />
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
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral600,
  },
  roleTabTextActive: {
    color: colors.gold600,
  },
  userCard: {
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
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral950,
  },
  userEmail: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 1,
  },
  userCompany: {
    fontSize: 11,
    color: colors.neutral600,
    marginTop: 2,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
