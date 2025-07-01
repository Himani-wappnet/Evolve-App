import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './Style';
import TopDecoration from '../../../components/TopDecoration';
import Toast from '../../../components/Toast';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import TextfieldComponent from '../../../components/TextFieldComponent';
import { icons } from '../../../constants/images';

const SignUpScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSignup = async () => {
    // Name validation
    if (!fullName.trim()) {
      setToast({ message: 'Please enter your name', type: 'error' });
      return;
    }

    if (fullName.trim().length < 3) {
      setToast({ message: 'Name must be at least 3 characters long', type: 'error' });
      return;
    }

    // Email validation
    if (!email.trim()) {
      setToast({ message: 'Please enter your email', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setToast({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }

    // Password validation
    if (!password) {
      setToast({ message: 'Please enter a password', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      const user = userCredential.user;

      if (user) {
        // Update user profile with name
        await user.updateProfile({
          displayName: fullName.trim(),
        });

        // Create user document in Firestore
        await firestore().collection('users').doc(user.uid).set({
          uid: user.uid,
          name: fullName.trim(),
          email: email.trim(),
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
          habits: [],
          goals: [],
          settings: {
            notifications: true,
            theme: 'light',
            language: 'en'
          }
        });

        // Store user token in AsyncStorage
        setToast({ message: 'Account created successfully!', type: 'success' });
        navigation.navigate('LoginPage', { toastMessage: "Signup Successfully" });
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setToast({ message: 'This email is already in use', type: 'error' });
      } else if (error.code === 'auth/invalid-email') {
        setToast({ message: 'The email address is invalid', type: 'error' });
      } else if (error.code === 'auth/weak-password') {
        setToast({ 
          message: 'The password is too weak. Try adding numbers and special characters', 
          type: 'error' 
        });
      } else {
        setToast({ message: error.message, type: 'error' });
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6db3f2', '#ffffff']} style={styles.container}>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onHide={() => setToast(null)}
          />
        )}

        <KeyboardAwareScrollView
          behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 80}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          <TopDecoration />

          <View style={styles.mainContent}>
            <View style={styles.card}>
              <Text style={styles.title}>Sign Up</Text>

              {/* <TextInput
                placeholder="Full Name"
                placeholderTextColor="#888"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              /> */}
<TextfieldComponent
              placeholder={'Full Name'}
              value={fullName}
              onChangeText={setFullName}
              icon={icons.IC_USER}
              style={styles.input}
            />
             <TextfieldComponent
              placeholder={'Email'}
              value={email}
              onChangeText={setEmail}
              icon={icons.IC_USER}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextfieldComponent
              placeholder={'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={styles.input}
            />
            <TextfieldComponent
              placeholder={'Confirm Password'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={styles.input}
            />
              {/* <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              /> */}

              <TouchableOpacity style={styles.signInButton} onPress={handleSignup}>
                <Text style={styles.signInText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Already have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('LoginPage')}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUpScreen;
