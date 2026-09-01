import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const AppBadge = ({ label, variant = 'default', style, textStyle }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
      case 'Present':
      case 'Accepted':
      case 'Approved':
      case 'Completed':
      case 'Active':
        return {
          bg: colors.successLight,
          text: '#065F46',
          border: colors.successBorder,
        };
      case 'warning':
      case 'Awaiting':
      case 'Pending':
      case 'In Progress':
      case 'Review':
        return {
          bg: colors.warningLight,
          text: '#92400E',
          border: colors.warningBorder,
        };
      case 'danger':
      case 'Absent':
      case 'Rejected':
      case 'Blocked':
        return {
          bg: colors.dangerLight,
          text: '#991B1B',
          border: colors.dangerBorder,
        };
      case 'gold':
      case 'Primary':
        return {
          bg: colors.gold50,
          text: colors.gold800,
          border: colors.gold200,
        };
      case 'info':
      case 'Blue':
        return {
          bg: colors.infoLight,
          text: '#1E40AF',
          border: colors.infoBorder,
        };
      default:
        return {
          bg: colors.neutral100,
          text: colors.neutral700,
          border: colors.neutral200,
        };
    }
  };

  const current = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: current.text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
