import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'gold', style }) => {
  const getTheme = () => {
    switch (color) {
      case 'gold':
        return { bg: colors.gold50, iconBg: colors.gold100, iconColor: colors.gold700 };
      case 'emerald':
      case 'success':
        return { bg: colors.successLight, iconBg: '#D1FAE5', iconColor: '#059669' };
      case 'blue':
      case 'info':
        return { bg: colors.infoLight, iconBg: '#DBEAFE', iconColor: '#2563EB' };
      case 'purple':
        return { bg: colors.purpleLight, iconBg: '#EDE9FE', iconColor: '#7C3AED' };
      default:
        return { bg: colors.neutral100, iconBg: colors.neutral200, iconColor: colors.neutral700 };
    }
  };

  const theme = getTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.bg }, style]}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {Icon && (
          <View style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}>
            <Icon size={16} color={theme.iconColor} />
          </View>
        )}
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flex: 1,
    minWidth: 140,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral600,
    flex: 1,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral950,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: colors.neutral500,
    marginTop: 2,
  },
});
