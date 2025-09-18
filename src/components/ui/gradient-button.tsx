import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';

interface GradientButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function GradientButton({
  children,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  textStyle,
  icon,
}: GradientButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`size_${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const gradientColors = gradients[variant] || gradients.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={buttonStyle}
    >
      <LinearGradient
        colors={disabled ? [colors.gray[400], colors.gray[500]] : gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon && <>{icon}</>}
        <Text style={textStyles}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  size_sm: {
    borderRadius: 18,
  },
  size_default: {
    borderRadius: 22,
  },
  size_lg: {
    borderRadius: 28,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  disabledText: {
    opacity: 0.7,
  },
  size_smText: {
    fontSize: 14,
  },
  size_defaultText: {
    fontSize: 16,
  },
  size_lgText: {
    fontSize: 18,
    fontWeight: '700',
  },
});