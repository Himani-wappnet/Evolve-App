import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import TextfieldComponent from '../../components/TextFieldComponent';
import RactangularButton from '../../components/RactangularButton';
import SsoButton from '../../components/SsoButton';
import LableComponent from '../../components/LableComponent';
import { TextStyles } from '../../constants/textstyle';

import { Colors } from '../../constants/colors';
import { icons } from '../../constants/images';
import { Dimens } from '../../constants/dimens';
import { Strings } from '../../constants/strings';
import { styles } from './Styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Toast from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignupPageProps {
  navigation: NativeStackNavigationProp<any>;
}

const SignupPage = ({ navigation }: SignupPageProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSignup = async () => {
    // Name validation
    if (!name.trim()) {
      setToast({ message: 'Please enter your name', type: 'error' });
      return;
    }

    if (name.trim().length < 3) {
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
          displayName: name.trim(),
        });

        // Create user document in Firestore
        await firestore().collection('users').doc(user.uid).set({
          uid: user.uid,
          name: name.trim(),
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
      {/* <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      /> */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, height: heightPercentageToDP("75%") }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <LableComponent value={Strings.SIGNUPTITLE} style={styles.titleText} />
          </View>
          <View style={styles.content}>
            <TextfieldComponent
              placeholder={'Full Name'}
              value={name}
              onChangeText={setName}
              icon={icons.IC_USER}
              style={{ marginBottom: 31 }}
            />
            <TextfieldComponent
              placeholder={'Email'}
              value={email}
              onChangeText={setEmail}
              icon={icons.IC_USER}
              keyboardType="email-address"
              style={{ marginBottom: 31 }}
            />
            <TextfieldComponent
              placeholder={'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={{ marginBottom: 31 }}
            />
            <TextfieldComponent
              placeholder={'Confirm Password'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              icon={icons.IC_PASSWORD}
              style={{ marginBottom: 87 }}
            />

            <RactangularButton
              title={'Create Account'}
              onPress={handleSignup}
              style={{ marginBottom: 31 }}
            />
            <LableComponent
              value={'-OR Continue With-'}
              style={styles.continueText}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 28,
              }}>
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_GOOGLE}
                style={styles.ssoButton}
              />
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_APPLE}
                style={styles.ssoButton}
                iconSize={Dimens.icon.APPLESIZE}
              />
              <SsoButton
                onPress={() => console.log('Google Login Pressed!')}
                imageSource={icons.IC_FACEBOOK}
                iconSize={Dimens.icon.FACEBOOKSIZE}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              <LableComponent
                value={'I Already Have an Account'}
                style={[
                  styles.footerText,
                  { fontFamily: TextStyles.regularText, color: Colors.darkGray2 },
                ]}
              />
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <LableComponent
                  value={'Login'}
                  style={[
                    styles.footerText,
                    {
                      fontFamily: TextStyles.semiBoldText,
                      color: Colors.primary,
                      textDecorationLine: 'underline',
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupPage;
