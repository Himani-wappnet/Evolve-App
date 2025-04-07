import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigationRef } from './src/navigation/navigationService';
import { InteractionManager } from 'react-native';

function App(): React.JSX.Element {

  useEffect(() => {
    async function setupChannel() {
      await notifee.createChannel({
        id: 'alarm',
        name: 'Alarm Channel',
        importance: AndroidImportance.HIGH, // Ensure high importance
        sound: 'default', // or custom sound
      });
    }
  
    setupChannel();
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        const alarmId = detail.notification?.id;
        const puzzleType = detail.notification?.data?.puzzleType || 'math';

        if (alarmId) {
          navigationRef.current?.navigate('PuzzleScreen', {
            alarmId,
            puzzleType,
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        const { notification } = initialNotification;
        const alarmId = notification.id;
        const puzzleType = notification.data?.puzzleType;
  
        if (alarmId) {
          console.log('Navigating to PuzzleScreen after cold start');
          navigationRef.current?.navigate('PuzzleScreen', {
            alarmId,
            puzzleType,
          });
        }
      }
    });
  }, []);

  return <AppNavigator navigationRef={navigationRef} />;
}

export default App;

  // useEffect(() => {
  //   async function checkInitialNotification() {
  //     const initialNotification = await notifee.getInitialNotification();
  //     if (initialNotification) {
  //       const { notification } = initialNotification;
  //       const alarmId = notification.id;
  //       const puzzleType = notification.data?.puzzleType;
  
  //       if (alarmId) {
  //         console.log('Opening PuzzleScreen from background notification');
  //         navigationRef.current?.navigate('PuzzleScreen', {
  //           alarmId,
  //           puzzleType,
  //         });
  //       }
  //     }
  //   };
  //   checkInitialNotification();
  // }, []);


// import React, { useEffect, useState } from 'react';

// import AppNavigator from './src/navigation/AppNavigator';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore'; // If using modular SDK
// import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

// // Replace with your actual Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s",
//   authDomain: "evolve-3cb23.firebaseapp.com",
//   databaseURL: "https://evolve-3cb23.firebaseio.com",
//   projectId: "evolve-3cb23",
//   storageBucket: "evolve-3cb23.appspot.com",
//   messagingSenderId: "1013020519727",
//   appId: "1:1013020519727:android:cb35cf21140ce9aeea85da",
//   // ... other configurations
// };

// let firebaseInitialized = false;
// let db: ReturnType<typeof getFirestore> | null = null; // Type for Firestore instance

// function App(): React.JSX.Element {
//   const [loadingFirebase, setLoadingFirebase] = useState(true);
//   const [errorFirebase, setErrorFirebase] = useState<string | null>(null);

//   useEffect(() => {
//     const initializeFirebaseApp = async () => {
//       try {
//         if (!firebaseInitialized) {
//           initializeApp(firebaseConfig);
//           db = getFirestore(); // Initialize Firestore instance
//           firebaseInitialized = true;
//           console.log('Firebase initialized successfully');
//         }
//       } catch (e: any) {
//         console.error('Error initializing Firebase:', e);
//         setErrorFirebase(e.message);
//       } finally {
//         setLoadingFirebase(false);
//       }
//     };

//     initializeFirebaseApp();
//   },);

//   if (loadingFirebase) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator
//           testID="loading-indicator"
//           size="large"
//           color="#007bff"
//         />
//       </View>
//     );
//   }

//   if (errorFirebase) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Firebase Initialization Error:</Text>
//         <Text style={styles.errorText}>{errorFirebase}</Text>
//       </View>
//     );
//   }

//   return <AppNavigator />;
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });

// export default App;

// In your App.tsx (or your main entry file)
// import React, { useEffect, useState } from 'react';
// import { initializeApp, getApps } from 'firebase/app';
// import AppNavigator from './src/navigation/AppNavigator';
// import { ActivityIndicator, View, StyleSheet } from 'react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s",
//   authDomain: "evolve-3cb23.firebaseapp.com",
//   databaseURL: "https://evolve-3cb23.firebaseio.com",
//   projectId: "evolve-3cb23",
//   storageBucket: "evolve-3cb23.appspot.com",
//   messagingSenderId: "1013020519727",
//   appId: "1:1013020519727:android:cb35cf21140ce9aeea85da",
// };

// function App(): React.JSX.Element {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!getApps().length) {
//       try {
//         initializeApp(firebaseConfig);
//       } catch (e) {
//         console.error('Firebase initialization failed:', e);
//       } finally {
//         setLoading(false); // Ensure loading stops
//       }
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     );
//   }

//   return <AppNavigator />;
// }

// const styles = StyleSheet.create({
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default App;
