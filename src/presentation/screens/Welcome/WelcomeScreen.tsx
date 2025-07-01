import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { icons, image } from '../../../constants/images';
import { Dimens } from '../../../constants/dimens';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../constants/colors';
import { styles } from './Style';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
  SignUpPage: undefined;
  LoginPage: undefined;
  Welcome: undefined;
};

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

GoogleSignin.configure({
  webClientId: '1013020519727-7ip28ils1qea0tm6i0kpadtrkvjnknmr.apps.googleusercontent.com', // from Firebase -> Project Settings -> Web client
});

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const checkUserLogin = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        navigation.replace('Dashboard'); 
      }
    };
    checkUserLogin();
  }, []);


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();
      
      // Start Google Sign-In
      const { idToken } = await GoogleSignin.signIn();
      console.log('ID TOKEN',idToken);
      
  
      // Create Firebase credential with the Google token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('Google credentials',googleCredential);
  
      // Sign in with Firebase using the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const { uid, displayName, email, photoURL } = userCredential.user;
  
      // Reference to user document in Firestore
      const userDocRef = firestore().collection('users').doc(uid);
      const userDoc = await userDocRef.get();
  
      // If the user is new, save their info
      if (!userDoc.exists) {
        await userDocRef.set({
          name: displayName,
          email,
          photo: photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Optionally update login time
        await userDocRef.update({
          lastLogin: firestore.FieldValue.serverTimestamp(),
        });
      }
  
      // Store UID/token locally for auto-login
      await AsyncStorage.setItem('userToken', uid);
  
      // Navigate to Dashboard
      navigation.replace('Dashboard');
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      // Optionally show an alert or toast to the user
    }
  };
  

  return (
    <View style={styles.container}>
        <View style={{ flex: 1 }}>
      
        <Image
  source={image.HABITTRACKING}
  style={styles.backgroundImage}
  resizeMode='cover'
/>
      <LinearGradient
          colors={['transparent', '#f2f4f7']}
          style={styles.bottomFade}
        />
</View>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Welcome to DailyFlow</Text>
        <Text style={styles.subtitle}>
  Transform your daily routine with smarter tracking for your habits, focus, meals, and wellness goals.
</Text>

        <TouchableOpacity style={styles.emailBtn} onPress={() => navigation.navigate('SignUpPage')}>
          <Text style={styles.emailBtnText}>Sign up with email</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
  <TouchableOpacity style={styles.socialBtn}>
    <View style={styles.socialBtnInner}>
      <Image source={icons.IC_APPLE} style={styles.socialLogo} />
      <Text style={styles.socialBtnText}>Sign up with Apple</Text>
    </View>
  </TouchableOpacity>
)}

{Platform.OS === 'android' && (
  <TouchableOpacity style={styles.socialBtn} onPress={signInWithGoogle}>
    <View style={styles.socialBtnInner}>
      <Image source={icons.IC_GOOGLE} style={styles.socialLogo} />
      <Text style={styles.socialBtnText}>Sign up with Google</Text>
    </View>
  </TouchableOpacity>
)}

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => navigation.navigate('LoginPage')}>
            Sign In
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;
