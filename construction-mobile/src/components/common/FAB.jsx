import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Plus } from 'lucide-react-native';

export const FAB = ({ onPress, icon: Icon = Plus, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.fab, style]}
    >
      <Icon size={24} color={colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold600,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 99,
  },
});
