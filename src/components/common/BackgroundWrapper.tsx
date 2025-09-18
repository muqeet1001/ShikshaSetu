import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  // Try to load background image, fallback if not available
  let backgroundImageSource;
  try {
    backgroundImageSource = require('../../../assets/background.jpg');
  } catch {
    // Fallback to a solid color background if background.jpg doesn't exist
    backgroundImageSource = null;
  }

  return (
    <View style={styles.container}>
      {/* Layer 1: Faded Background Image (30-40% opacity) */}
      {backgroundImageSource && (
        <Image 
          source={backgroundImageSource}
          style={styles.fadedBackgroundImage}
          resizeMode="cover"
        />
      )}
      
      {/* Layer 2: J&K Government Seal Overlay (Watermark) */}
      <Image 
        source={require('../../../assets/jk-seal.png')}
        style={styles.emblemOverlay}
        resizeMode="contain"
      />
      
      {/* Layer 3: Content Container */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb', // Professional government background
  },
  fadedBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.35, // 35% opacity - faded but visible
    zIndex: 0, // Behind everything
  },
  emblemOverlay: {
    position: 'absolute',
    top: '50%', // Center position
    left: '50%',
    width: 350,
    height: 350,
    marginTop: -175,
    marginLeft: -175,
    opacity: 0.15, // Visible watermark
    zIndex: 1, // Behind content but visible
    pointerEvents: 'none', // Don't block touch interactions
  },
  contentContainer: {
    flex: 1,
    zIndex: 10, // Above all background layers
    backgroundColor: 'transparent',
  },
});
