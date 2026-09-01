import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../../theme/colors';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.neutral200;
    switch (variant) {
      case 'primary': return colors.gold500;
      case 'secondary': return colors.neutral900;
      case 'danger': return colors.danger;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.gold500;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.neutral400;
    switch (variant) {
      case 'primary': return colors.white;
      case 'secondary': return colors.white;
      case 'danger': return colors.white;
      case 'outline': return colors.neutral800;
      case 'ghost': return colors.neutral700;
      default: return colors.white;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return disabled ? colors.neutral300 : colors.neutral300;
    return 'transparent';
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: isSmall ? 8 : isLarge ? 14 : 11,
          paddingHorizontal: isSmall ? 12 : isLarge ? 20 : 16,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {Icon && iconPosition === 'left' && (
            <Icon size={isSmall ? 14 : 18} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: isSmall ? 12 : isLarge ? 16 : 14,
                fontWeight: isSmall ? '600' : '700',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon size={isSmall ? 14 : 18} color={getTextColor()} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
