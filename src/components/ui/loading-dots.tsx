import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface LoadingDotsProps {
  size?: number;
  color?: string;
  colors?: string[];
  spacing?: number;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 16,
  color = '#3B82F6',
  colors,
  spacing = 8
}) => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const dotColors = colors || [color, color, color];

  useEffect(() => {
    const animateDot = (dotAnim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      animateDot(dot1Anim, 0),
      animateDot(dot2Anim, 200),
      animateDot(dot3Anim, 400),
    ]).start();
  }, []);

  const getDotStyle = (animValue: Animated.Value, backgroundColor: string) => [
    styles.dot,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginHorizontal: spacing / 2,
      backgroundColor,
      transform: [{
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.4],
        })
      }],
      opacity: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
      })
    }
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={getDotStyle(dot1Anim, dotColors[0])} />
      <Animated.View style={getDotStyle(dot2Anim, dotColors[1])} />
      <Animated.View style={getDotStyle(dot3Anim, dotColors[2])} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});