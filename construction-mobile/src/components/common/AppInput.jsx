import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  editable = true,
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          error ? styles.inputError : null,
          !editable ? styles.inputDisabled : null,
          multiline ? { height: numberOfLines * 24 + 20, alignItems: 'flex-start' } : null,
        ]}
      >
        {LeftIcon && <LeftIcon size={18} color={colors.neutral400} style={styles.leftIcon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral400}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          style={[styles.input, multiline ? styles.multilineInput : null, inputStyle]}
        />
        {RightIcon && <RightIcon size={18} color={colors.neutral400} style={styles.rightIcon} />}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral700,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  inputDisabled: {
    backgroundColor: colors.neutral100,
    borderColor: colors.neutral200,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral950,
    paddingVertical: 8,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
    fontWeight: '500',
  },
});
