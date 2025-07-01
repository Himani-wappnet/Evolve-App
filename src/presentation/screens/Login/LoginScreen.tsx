// LoginScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  SafeAreaView,
  Keyboard,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopDecoration from '../../../components/TopDecoration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from '../../../components/Toast';
import { styles } from './Style';
import TextfieldComponent from '../../../components/TextFieldComponent';
import { icons } from '../../../constants/images';

const { width } = Dimensions.get('window');

interface LoginPageProps {
    navigation: NativeStackNavigationProp<any>;
  }

  const LoginScreen = ({ navigation, route }: any) => {

    const [text, setText] = useState<string>('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null); 
    const scrollViewRef = useRef<ScrollView>(null);

    // useEffect(() => {
    //     const checkUserLogin = async () => {
    //       const userToken = await AsyncStorage.getItem('userToken');
    //       if (userToken) {
    //         navigation.replace('Dashboard'); // Auto navigate to Dashboard if logged in
    //       }
    //     };
    //     checkUserLogin();
    //   }, []);

      useEffect(() => {
        if (route.params?.toastMessage) {
            setToast({ message: route.params.toastMessage, type: 'success' });
        }
    }, [route.params?.toastMessage]);

    // Add keyboard listeners
    // useEffect(() => {
    //   const keyboardDidShowListener = Keyboard.addListener(
    //     'keyboardDidShow',
    //     () => {
    //       scrollViewRef.current?.scrollToEnd({ animated: true });
    //     }
    //   );

    //   return () => {
    //     keyboardDidShowListener.remove();
    //   };
    // }, []);

    const handleLogin = async () => {
        if (!text || !password) {
          setToast({ message: 'Please enter both email and password', type: 'error' }); 
          // navigation.replace('Dashboard');
          return;
        }
    
        try {
          const userCredential = await auth().signInWithEmailAndPassword(text, password);
          const user = userCredential.user;
    
          if (user) {
            // await AsyncStorage.setItem('hasSeenGetStarted', 'true');
            await AsyncStorage.setItem('userToken', user.uid); // Store login state
            navigation.replace('Dashboard',{toastMessage: 'Login successful'});
            console.log('USER RESPONSEEE',user);
            
          }
        } catch (error: any) {
          if (error.code === 'auth/invalid-email') {
            setToast({ message: 'Invalid Email, The email address is not valid.', type: 'error' }); 
    
            // Alert.alert('Invalid Email', 'The email address is not valid.');
          } else if (error.code === 'auth/user-not-found') {
            setToast({ message: 'No user found with this email.', type: 'error' }); 
    
            // Alert.alert('User Not Found', 'No user found with this email.');
          } else if (error.code === 'auth/wrong-password') {
            setToast({ message: 'Incorrect Password', type: 'error' }); 
    
            // Alert.alert('Incorrect Password', 'Please check your password.');
          } else {
            setToast({ message: "This email is not registered. Please sign up first.", type: 'error' }); 
    
            // Alert.alert('Error', error.message);
          }
        }
      };
    useEffect(() => {
      const backAction = () => {
        if (navigation.isFocused()) {
          // BackHandler.exitApp();
          navigation.navigate('Welcome');
          return true;
        }
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []);
    

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
            keyboardShouldPersistTaps="handled"
        >
            <TopDecoration/>
            <View style={styles.mainContent}>
              <View style={styles.card}>
                <Text style={styles.title}>Sign in</Text>

                {/* <TextInput
                  placeholder="Email"
                  placeholderTextColor="#888"
                  style={styles.input}
                  keyboardType="email-address"
                  value={text}
                  onChangeText={setText}
                  autoCapitalize="none"
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                /> */}
                 <TextfieldComponent
          placeholder={'Username or Email'}
          value={text}
          onChangeText={setText}
          icon={icons.IC_USER}
          keyboardType="email-address"
          style={{marginBottom: 31}}
        />
                <TextfieldComponent
          placeholder={'Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          icon={icons.IC_PASSWORD}
          style={{marginBottom: 9}}
        />
                {/* <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                /> */}

                <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>

              
            </View>
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
  Don't have an account?{' '}
  <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}  testID="signup-button">
    <Text style={styles.signUpLink}>Sign up</Text>
  </TouchableOpacity>
</Text>
              </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;
 