import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, RotateCcw } from 'lucide-react-native';

export const ImpersonationBanner = () => {
  const { isImpersonating, user, revertImpersonation } = useAuthStore();

  if (!isImpersonating || !user) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <ShieldAlert size={16} color="#B45309" style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          Impersonating: <Text style={styles.bold}>{user.name}</Text> ({user.role})
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={revertImpersonation}
        style={styles.revertBtn}
      >
        <RotateCcw size={12} color="#92400E" style={{ marginRight: 4 }} />
        <Text style={styles.revertText}>Return to Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  revertBtn: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  revertText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
});
