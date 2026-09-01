import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const LoadingScreen = ({ message = 'Loading ConstructIQ...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoLetter}>C</Text>
      </View>
      <ActivityIndicator size="large" color={colors.gold500} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.gold500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoLetter: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
  },
  spinner: {
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral500,
  },
});
