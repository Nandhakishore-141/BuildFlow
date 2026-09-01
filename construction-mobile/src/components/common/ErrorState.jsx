import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { AppButton } from './AppButton';
import { AlertTriangle } from 'lucide-react-native';

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <AlertTriangle size={26} color={colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {onRetry && (
        <AppButton
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    marginVertical: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#7F1D1D',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  retryBtn: {
    marginTop: 12,
    borderColor: colors.dangerBorder,
  },
});
