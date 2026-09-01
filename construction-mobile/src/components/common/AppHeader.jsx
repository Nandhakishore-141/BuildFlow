import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ArrowLeft } from 'lucide-react-native';

export const AppHeader = ({ title, subtitle, showBack = false, onBack, rightAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ArrowLeft size={20} color={colors.neutral900} />
          </TouchableOpacity>
        )}
        <View style={styles.textWrap}>
          <Text style={[typography.h2, styles.title]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[typography.bodySmall, styles.subtitle]} numberOfLines={2}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction && <View style={styles.rightWrap}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.neutral100,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.neutral950,
  },
  subtitle: {
    color: colors.neutral500,
    marginTop: 2,
  },
  rightWrap: {
    marginLeft: 12,
  },
});
