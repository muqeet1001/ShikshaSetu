import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, Easing, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from "../ui/gradient-button";
import { colors, gradients } from '../../theme/colors';

interface SplashScreenProps {
  onContinue: () => void;
}

const { height, width } = Dimensions.get('window');
const isMobile = width < 768;

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  
  // Animation refs for the dots
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start dots animation
    const animateDots = () => {
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
    };

    animateDots();

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animate button entrance
      Animated.parallel([
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacityAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowButton(true);
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#eff6ff', '#ffffff', '#fff7ed']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Government Logo */}
        <View style={styles.emblemContainer}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.governmentLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.iconRing}>
            <Ionicons name="star" size={20} color={colors.secondary[500]} style={styles.starIcon1} />
            <Ionicons name="book" size={16} color={colors.accent.orange} style={styles.starIcon2} />
            <Ionicons name="trophy" size={18} color={colors.accent.yellow} style={styles.starIcon3} />
          </View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ShikshaSetu</Text>
          <View style={styles.subtitleContainer}>
            <Ionicons name="location" size={16} color={colors.theme.blue} />
            <Text style={styles.subtitle}>Jammu & Kashmir</Text>
          </View>
          <Text style={styles.department}>Government of Jammu & Kashmir</Text>
          <Text style={styles.officialText}>Official Career Guidance Portal</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <Animated.View 
                style={[
                  styles.animatedDot, 
                  { backgroundColor: colors.theme.blue },
                  {
                    transform: [{
                      scale: dot1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.4],
                      })
                    }],
                    opacity: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.animatedDot, 
                  { backgroundColor: colors.theme.orange },
                  {
                    transform: [{
                      scale: dot2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.4],
                      })
                    }],
                    opacity: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.animatedDot, 
                  { backgroundColor: colors.theme.darkBlue },
                  {
                    transform: [{
                      scale: dot3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.4],
                      })
                    }],
                    opacity: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.loadingText}>Initializing your journey...</Text>
          </View>
        ) : (
          <Animated.View 
            style={[
              {
                transform: [{ scale: buttonScaleAnim }],
                opacity: buttonOpacityAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.getStartedButton,
                isMobile && styles.getStartedButtonMobile,
                isButtonPressed && styles.getStartedButtonPressed
              ]}
              onPress={onContinue}
              onPressIn={() => setIsButtonPressed(true)}
              onPressOut={() => setIsButtonPressed(false)}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      
      {/* Government Footer on Splash */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Compliant with Government UI guidelines</Text>
        <Text style={styles.footerDate}>Last updated: 14 Sep 2025</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 380,
    width: '100%',
  },
  emblemContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme.white,
    shadowColor: colors.theme.blue,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.theme.orange,
  },
  governmentLogo: {
    width: 120,
    height: 120,
  },
  iconRing: {
    position: 'absolute',
    width: 160,
    height: 160,
  },
  starIcon1: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  starIcon2: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  starIcon3: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.theme.blue,
    textAlign: 'center',
  },
  department: {
    fontSize: 16,
    color: colors.theme.orange,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 4,
  },
  officialText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  animatedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[600],
    fontWeight: '500',
  },
  getStartedButton: {
    backgroundColor: colors.theme.blue,
    borderRadius: 9999, // Pill shape
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: colors.theme.blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  getStartedButtonPressed: {
    backgroundColor: colors.theme.darkBlue, // Darker blue on press
    transform: [{ scale: 0.98 }],
  },
  getStartedButtonMobile: {
    width: '90%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
  footerDate: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 4,
  },
});
