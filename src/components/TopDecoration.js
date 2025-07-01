import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const TopDecoration = () => {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const shootingStar = useRef(new Animated.Value(0)).current;

  const starOpacities = Array.from({ length: 6 }).map(() =>
    useRef(new Animated.Value(Math.random() * 0.5 + 0.5)).current
  );

  useEffect(() => {
    const createFloating = (value, duration, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createFloating(float1, 5000);
    createFloating(float2, 7000, 1000);

    // Stars twinkling
    starOpacities.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star, {
            toValue: Math.random(),
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(star, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Shooting star
    Animated.loop(
      Animated.sequence([
        Animated.timing(shootingStar, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(shootingStar, {
          toValue: 0,
          duration: 0,
          delay: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateFloat1 = {
    transform: [
      {
        translateY: float1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -12],
        }),
      },
    ],
  };

  const translateFloat2 = {
    transform: [
      {
        translateX: float2.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };

  const shootingStyle = {
    transform: [
      {
        translateX: shootingStar.interpolate({
          inputRange: [0, 1],
          outputRange: [-150, width + 150],
        }),
      },
      {
        translateY: shootingStar.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 80],
        }),
      },
    ],
    opacity: 0.8,
  };

  return (
    <View style={styles.container}>
      {/* Orbit lines */}
      <Svg height="100%" width="100%" style={styles.svg}>
        <Path
          d="M 0 80 Q 100 40 200 80 T 400 80"
          stroke="#fff"
          strokeWidth="1.2"
          fill="none"
          opacity={0.1}
        />
        <Path
          d="M 0 140 Q 150 90 300 140 T 600 140"
          stroke="#fff"
          strokeWidth="1"
          fill="none"
          opacity={0.08}
        />
      </Svg>

      {/* Nebula Glows */}
      <View style={[styles.glow, { top: 60, left: 40, backgroundColor: '#ffe8a3' }]} />
      <View style={[styles.glow, { top: 110, right: 50, backgroundColor: '#ffd3e0' }]} />

      {/* Floating Planets */}
      <Animated.View style={[styles.planet, styles.planet1, translateFloat1]} />
      <Animated.View style={[styles.planet, styles.planet2, translateFloat2]} />

      {/* Floating Orbs */}
      <Animated.View style={[styles.orb, { top: 90, left: 30 }, translateFloat1]} />
      <Animated.View style={[styles.orb, { top: 140, right: 40 }, translateFloat2]} />

      {/* Twinkling Stars */}
      {starOpacities.map((opacity, i) => {
        const style = {
          opacity,
          top: 30 + i * 20,
          left: i % 2 === 0 ? 40 + i * 20 : undefined,
          right: i % 2 !== 0 ? 40 + i * 20 : undefined,
        };
        return <Animated.View key={i} style={[styles.star, style]} />;
      })}

      {/* Shooting Star */}
      {/* <Animated.View style={[styles.shootingStar, shootingStyle]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.4,
    backgroundColor: '#6db3f2',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  planet: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  planet1: {
    top: 60,
    left: 60,
    backgroundColor: '#ff8c00',
  },
  planet2: {
    top: 110,
    right: 50,
    backgroundColor: '#ffd700',
  },
  orb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff55',
  },
  star: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  shootingStar: {
    position: 'absolute',
    width: 80,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
    blurRadius: 50,
  },
});

export default TopDecoration;
 