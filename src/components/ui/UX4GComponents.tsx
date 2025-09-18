import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  AccessibilityProps,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Language = 'EN' | 'HI' | 'UR';

// Government-standard color tokens
const UX4G_COLORS = {
  primary: '#3B82F6',
  secondary: '#f97316', 
  accent: '#60a5fa',
  success: '#3b82f6',
  warning: '#F59E0B',
  error: '#EF4444',
  neutral: '#6B7280',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  // WCAG AA compliant colors
  highContrast: '#000000',
  contrastBackground: '#FFFFFF',
};

// UX4G Chip Component
interface UX4GChipProps extends AccessibilityProps {
  label: string;
  selected?: boolean;
  variant?: 'filter' | 'status' | 'category';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  currentLanguage?: Language;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  style?: ViewStyle;
}

export const UX4GChip: React.FC<UX4GChipProps> = ({
  label,
  selected = false,
  variant = 'filter',
  size = 'md',
  onPress,
  disabled = false,
  currentLanguage = 'EN',
  icon,
  closable = false,
  onClose,
  style,
  ...accessibilityProps
}) => {
  const isRTL = currentLanguage === 'UR';
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getChipStyle = () => {
    const baseStyle: any[] = [chipStyles.base, chipStyles[size], chipStyles[variant]];
    
    if (selected) {
      baseStyle.push(chipStyles.selected, chipStyles[`${variant}Selected` as keyof typeof chipStyles]);
    }
    
    if (disabled) {
      baseStyle.push(chipStyles.disabled);
    }
    
    if (isRTL) {
      baseStyle.push(chipStyles.rtl);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [chipStyles.text, chipStyles[`text${size.toUpperCase() as 'SM' | 'MD' | 'LG'}`]];
    
    if (selected) {
      baseStyle.push(chipStyles.textSelected);
    }
    
    if (disabled) {
      baseStyle.push(chipStyles.textDisabled);
    }
    
    if (isRTL) {
      baseStyle.push(chipStyles.textRTL);
    }
    
    return baseStyle;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: animatedScale }] }, style]}>
      <TouchableOpacity
        style={getChipStyle() as ViewStyle[]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={label}
        {...accessibilityProps}
      >
        {icon && (
          <View style={[chipStyles.iconContainer, isRTL && chipStyles.iconContainerRTL]}>
            {icon}
          </View>
        )}
        <Text style={getTextStyle() as TextStyle[]}>{label}</Text>
        {closable && onClose && (
          <TouchableOpacity
            style={[chipStyles.closeButton, isRTL && chipStyles.closeButtonRTL]}
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${label}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={14} color={selected ? UX4G_COLORS.background : UX4G_COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// UX4G Avatar Component
interface UX4GAvatarProps extends AccessibilityProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  imageUrl?: string;
  backgroundColor?: string;
  onPress?: () => void;
  currentLanguage?: Language;
  style?: ViewStyle;
}

export const UX4GAvatar: React.FC<UX4GAvatarProps> = ({
  name,
  size = 'md',
  verified = false,
  imageUrl,
  backgroundColor,
  onPress,
  currentLanguage = 'EN',
  style,
  ...accessibilityProps
}) => {
  const isRTL = currentLanguage === 'UR';
  
  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    if (backgroundColor) return backgroundColor;
    
    const colors = [
      UX4G_COLORS.primary,
      UX4G_COLORS.secondary,
      UX4G_COLORS.accent,
      '#8B5CF6',
      '#06B6D4',
      '#EF4444'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const avatarStyle = [
    avatarStyles.base,
    avatarStyles[size],
    { backgroundColor: getAvatarColor(name) },
    style
  ];

  const textStyle = [
    avatarStyles.text,
    avatarStyles[`text${size.toUpperCase() as 'XS' | 'SM' | 'MD' | 'LG' | 'XL'}`],
    isRTL && avatarStyles.textRTL
  ];

  const content = (
    <View style={avatarStyle}>
      <Text style={textStyle}>{getInitials(name)}</Text>
      {verified && (
        <View style={[
          avatarStyles.verifiedBadge,
          avatarStyles[`verifiedBadge${size.toUpperCase() as 'XS' | 'SM' | 'MD' | 'LG' | 'XL'}`],
          isRTL && avatarStyles.verifiedBadgeRTL
        ]}>
          <Ionicons name="checkmark" size={avatarStyles[`verifiedIcon${size.toUpperCase() as 'XS' | 'SM' | 'MD' | 'LG' | 'XL'}`].fontSize} color={UX4G_COLORS.background} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${name}${verified ? ', verified' : ''}`}
        {...accessibilityProps}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityLabel={`${name}${verified ? ', verified' : ''}`}
      {...accessibilityProps}
    >
      {content}
    </View>
  );
};

// UX4G Badge Component
interface UX4GBadgeProps extends AccessibilityProps {
  children: React.ReactNode;
  variant?: 'verified' | 'official' | 'warning' | 'info' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  currentLanguage?: Language;
  style?: ViewStyle;
}

export const UX4GBadge: React.FC<UX4GBadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  currentLanguage = 'EN',
  style,
  ...accessibilityProps
}) => {
  const isRTL = currentLanguage === 'UR';
  
  const badgeStyle = [
    badgeStyles.base,
    badgeStyles[size],
    badgeStyles[variant],
    isRTL && badgeStyles.rtl,
    style
  ];

  const textStyle = [
    badgeStyles.text,
    badgeStyles[`text${size.toUpperCase() as 'SM' | 'MD' | 'LG'}`],
    (badgeStyles as any)[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    isRTL && badgeStyles.textRTL
  ];

  return (
    <View
      style={badgeStyle}
      accessible={true}
      accessibilityRole="text"
      {...accessibilityProps}
    >
      {typeof children === 'string' ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

// Styles
const chipStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 44, // WCAG AA minimum touch target
    backgroundColor: UX4G_COLORS.surface,
    borderColor: UX4G_COLORS.border,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  filter: {
    backgroundColor: UX4G_COLORS.surface,
    borderColor: UX4G_COLORS.border,
  },
  status: {
    backgroundColor: UX4G_COLORS.surface,
    borderColor: UX4G_COLORS.secondary,
  },
  category: {
    backgroundColor: UX4G_COLORS.background,
    borderColor: UX4G_COLORS.primary,
  },
  selected: {
    backgroundColor: UX4G_COLORS.primary,
    borderColor: UX4G_COLORS.primary,
  },
  filterSelected: {
    backgroundColor: UX4G_COLORS.primary,
  },
  statusSelected: {
    backgroundColor: UX4G_COLORS.secondary,
  },
  categorySelected: {
    backgroundColor: UX4G_COLORS.accent,
  },
  disabled: {
    backgroundColor: UX4G_COLORS.surface,
    borderColor: UX4G_COLORS.border,
    opacity: 0.5,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  text: {
    fontWeight: '500',
    color: UX4G_COLORS.text,
  },
  textSM: {
    fontSize: 12,
  },
  textMD: {
    fontSize: 14,
  },
  textLG: {
    fontSize: 16,
  },
  textSelected: {
    color: UX4G_COLORS.background,
  },
  textDisabled: {
    color: UX4G_COLORS.textMuted,
  },
  textRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
  iconContainer: {
    marginRight: 6,
  },
  iconContainerRTL: {
    marginRight: 0,
    marginLeft: 6,
  },
  closeButton: {
    marginLeft: 6,
    padding: 2,
  },
  closeButtonRTL: {
    marginLeft: 0,
    marginRight: 6,
  },
});

const avatarStyles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    position: 'relative',
  },
  xs: {
    width: 24,
    height: 24,
  },
  sm: {
    width: 32,
    height: 32,
  },
  md: {
    width: 40,
    height: 40,
  },
  lg: {
    width: 48,
    height: 48,
  },
  xl: {
    width: 64,
    height: 64,
  },
  text: {
    fontWeight: '600',
    color: UX4G_COLORS.background,
  },
  textXS: {
    fontSize: 10,
  },
  textSM: {
    fontSize: 12,
  },
  textMD: {
    fontSize: 14,
  },
  textLG: {
    fontSize: 16,
  },
  textXL: {
    fontSize: 20,
  },
  textRTL: {
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: UX4G_COLORS.secondary,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: UX4G_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadgeXS: {
    width: 12,
    height: 12,
    top: -2,
    right: -2,
  },
  verifiedBadgeSM: {
    width: 16,
    height: 16,
    top: -2,
    right: -2,
  },
  verifiedBadgeMD: {
    width: 18,
    height: 18,
    top: -2,
    right: -2,
  },
  verifiedBadgeLG: {
    width: 20,
    height: 20,
    top: -2,
    right: -2,
  },
  verifiedBadgeXL: {
    width: 24,
    height: 24,
    top: -4,
    right: -4,
  },
  verifiedBadgeRTL: {
    right: 'auto',
    left: -2,
  },
  verifiedIconXS: {
    fontSize: 8,
  },
  verifiedIconSM: {
    fontSize: 10,
  },
  verifiedIconMD: {
    fontSize: 12,
  },
  verifiedIconLG: {
    fontSize: 14,
  },
  verifiedIconXL: {
    fontSize: 16,
  },
});

const badgeStyles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verified: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  official: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  info: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rtl: {
    alignSelf: 'flex-end',
  },
  text: {
    fontWeight: '500',
  },
  textSM: {
    fontSize: 11,
  },
  textMD: {
    fontSize: 12,
  },
  textLG: {
    fontSize: 14,
  },
  textVerified: {
    color: '#065F46',
  },
  textOfficial: {
    color: '#1E40AF',
  },
  textWarning: {
    color: '#92400E',
  },
  textInfo: {
    color: '#0C4A6E',
  },
  textSuccess: {
    color: '#065F46',
  },
  textError: {
    color: '#991B1B',
  },
  textRTL: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'NotoSansUrdu' : 'System',
  },
});

export { UX4G_COLORS };