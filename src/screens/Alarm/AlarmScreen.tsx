import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  Platform,
  AppState,
  AppStateStatus,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import notifee, { 
  TriggerType, 
  AndroidImportance, 
  EventType, 
  AndroidCategory,
  TimestampTrigger,
  Event,
  TriggerNotification,
} from '@notifee/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './Styles';

type RootStackParamList = {
  Alarm: undefined;
  PuzzleScreen: { alarmId: string };
};

type AlarmScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Alarm'>;
};

type Alarm = {
  id: string;
  time: string;
  isEnabled: boolean;
  puzzleType: 'math' | 'pattern' | 'memory';
  days: string[];
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmScreen: React.FC<AlarmScreenProps> = ({ navigation }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    loadAlarms();
  }, []);

  const stopAlarmSound = async (alarmId: string) => {
    console.log("stopAlarmSound", alarmId);
    await notifee.stopForegroundService(); // Stops any foreground service playing sound
    await notifee.cancelNotification(alarmId); // Cancels the notification
  };

  // useEffect(() => {
  //   const unsubscribeForeground = notifee.onForegroundEvent(async ({ type, detail }: Event) => {
  //     console.log('Foreground event type:', EventType[type]);
  //     console.log('Foreground event detail:', detail);
      
  //     // Handle different event types
  //     switch (type) {
  //       case EventType.TRIGGER_NOTIFICATION_CREATED:
  //         console.log('Alarm has been scheduled');
  //         // Check if this is the actual trigger time
  //         if (detail.notification?.data?.alarmTime) {
  //           const scheduledTime = new Date(detail.notification.data.alarmTime);
  //           const now = new Date();
            
  //           // Only proceed if we're within 1 minute of the scheduled time
  //           if (now >= scheduledTime) {
  //             console.log('Alarm time reached - displaying notification');
  //             await notifee.displayNotification({
  //               id: detail.notification.id,
  //               title: 'Wake Up! Time to Solve a Puzzle',
  //               body: 'Tap to solve the puzzle and stop the alarm',
  //               android: {
  //                 channelId: 'alarm',
  //                 importance: AndroidImportance.HIGH,
  //                 sound: 'alarm',
  //                 ongoing: true,
  //                 category: AndroidCategory.ALARM,
  //                 autoCancel: false,
  //               },
  //             });
  //             navigation.navigate('PuzzleScreen', { alarmId: detail.notification.id });
  //           } else {
  //             console.log('Ignoring trigger - not at scheduled time');
  //           }
  //         }
  //         break;

  //       case EventType.PRESS:
  //         if (detail.notification?.id) {
  //           console.log('Notification pressed in foreground');
  //           stopAlarmSound(detail.notification.id);
  //           navigation.navigate('PuzzleScreen', { alarmId: detail.notification.id });
  //         }
  //         break;

  //       default:
  //         console.log('Unhandled event type:', EventType[type]);
  //     }
  //   });

  //   const unsubscribeBackground = notifee.onBackgroundEvent(async ({ type, detail }: Event) => {
  //     console.log('Background event type:', EventType[type]);
  //     console.log('Background event detail:', detail);
      
  //     switch (type) {
  //       case EventType.TRIGGER_NOTIFICATION_CREATED:
  //         console.log('Trigger event received in background - checking if it\'s time to trigger');
  //         if (detail.notification?.data?.alarmTime) {
  //           const scheduledTime = new Date(detail.notification.data.alarmTime);
  //           const now = new Date();
            
  //           // Only proceed if we're within 1 minute of the scheduled time
  //           if (Math.abs(scheduledTime.getTime() - now.getTime()) < 60000) {
  //             console.log('Alarm time reached in background - creating wake-up notification');
  //             await notifee.displayNotification({
  //               id: detail.notification.id,
  //               title: 'Wake Up! Time to Solve a Puzzle',
  //               body: 'Tap to solve the puzzle and stop the alarm',
  //               android: {
  //                 channelId: 'alarm',
  //                 importance: AndroidImportance.HIGH,
  //                 sound: 'alarm',
  //                 ongoing: true,
  //                 fullScreenAction: {
  //                   id: 'puzzle',
  //                   launchActivity: 'default',
  //                 },
  //                 pressAction: {
  //                   id: 'puzzle',
  //                   launchActivity: 'default',
  //                 },
  //                 category: AndroidCategory.ALARM,
  //                 asForegroundService: true,
  //                 autoCancel: false,
  //               },
  //             });
  //           } else {
  //             console.log('Ignoring background trigger - not at scheduled time');
  //           }
  //         }
  //         break;

  //       case EventType.PRESS:
  //         if (detail?.notification?.id) {
  //           console.log('Notification pressed in background');
  //           stopAlarmSound(detail.notification.id);
  //           const scheme = Platform.select({ ios: 'yourapp://', android: 'yourapp://' });
  //           await Linking.openURL(`${scheme}puzzle/${detail.notification.id}`);
  //         }
  //         break;

  //       default:
  //         console.log('Unhandled background event type:', EventType[type]);
  //     }
  //   });

  //   // Handle app state changes
  //   const appStateSubscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
  //     if (nextAppState === 'active') {
  //       // App has come to the foreground
  //       const initialNotification = await notifee.getInitialNotification();
  //       if (initialNotification?.notification?.id) {
  //         // App was opened from a notification
  //         navigation.navigate('PuzzleScreen', { alarmId: initialNotification.notification.id });
  //       }
  //     }
  //   });
  
  //   return () => {
  //     unsubscribeForeground();
  //     unsubscribeBackground();
  //     appStateSubscription.remove();
  //   };
  // }, [navigation]);

  useEffect(() => {
    const unsubscribeForeground = notifee.onForegroundEvent(async ({ type, detail }) => {
      console.log('Foreground event:', EventType[type]);
  
      if (type === EventType.TRIGGER_NOTIFICATION_CREATED) {
        console.log('Trigger notification fired!');
  
        navigation.navigate('PuzzleScreen', { alarmId: detail.notification.id });
      }
    });
  
    return () => {
      unsubscribeForeground();
    };
  }, [navigation]);
  
  useEffect(() => {
    const requestPermissions = async () => {
      const settings = await notifee.requestPermission();
      console.log("Notification permission settings:", settings);
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    async function requestPermissions() {
      const settings = await notifee.requestPermission();
      if (settings.ios?.criticalAlert || settings.android?.alarm) {
        console.log('Alarm permission granted');
      } else {
        console.log('Alarm permission denied');
      }
    }
    requestPermissions();
  }, []);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('alarms');
      if (savedAlarms) {
        setAlarms(JSON.parse(savedAlarms));
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (updatedAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };

  const createTriggerNotification = async (alarm: Alarm) => {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    console.log(`Setting alarm for ${alarm.time}`);

    // Get current date and time
    const now = new Date();
    
    // Create alarm time for today
    let alarmTime = new Date();
    // Reset seconds and milliseconds to ensure exact timing
    alarmTime.setHours(hours, minutes, 0, 0);

    // Compare times by converting to minutes since midnight
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const alarmMinutes = hours * 60 + minutes;

    // If alarm time has already passed today or is within the next minute, set it for tomorrow
    if (alarmMinutes <= currentMinutes) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    console.log("Current time:", now.toLocaleString());
    console.log("Alarm will trigger at:", alarmTime.toLocaleString());

    // Create the channel first
    await notifee.createChannel({
      id: 'alarm',
      name: 'Alarm Channel',
      lights: false,
      vibration: true,
      importance: AndroidImportance.HIGH,
      sound: 'alarm',
      bypassDnd: true,
    });

    // Cancel any existing notification with this ID first
    await notifee.cancelTriggerNotification(alarm.id);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: alarmTime.getTime(),
      alarmManager: true,
      repeatFrequency: undefined, // Make sure there's no repeat
    };

    // Create the trigger notification
    await notifee.createTriggerNotification(
      {
        id: alarm.id,
        title: 'Alarm Scheduled',
        body: `Alarm set for ${format(alarmTime, 'HH:mm')}`,
        data: {
          alarmTime: alarmTime.toISOString(),
        },
        android: {
          channelId: 'alarm',
          importance: AndroidImportance.DEFAULT,
          ongoing: false,
          pressAction: {
            id: 'default',
          },
          showTimestamp: true,
        },
      },
      trigger,
    );

    // Log the scheduled triggers for debugging
    const triggers = await notifee.getTriggerNotifications();
    console.log('Current scheduled triggers:', triggers.map(t => ({
      id: t.notification.id,
      scheduledTime: format(new Date((t.trigger as TimestampTrigger).timestamp), 'HH:mm:ss'),
      trigger: t.trigger,
    })));
  };

  const handleAddAlarm = async () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: format(selectedTime, 'HH:mm'),
      isEnabled: true,
      puzzleType: 'math',
      days: [],
    };

    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    await saveAlarms(updatedAlarms);
    await createTriggerNotification(newAlarm);
    setShowTimePicker(false);
  };

  const toggleAlarm = async (id: string) => {
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        return { ...alarm, isEnabled: !alarm.isEnabled };
      }
      return alarm;
    });
    setAlarms(updatedAlarms);
    await saveAlarms(updatedAlarms);

    const alarm = updatedAlarms.find(a => a.id === id);
    if (alarm?.isEnabled) {
      await createTriggerNotification(alarm);
    } else {
      await notifee.cancelTriggerNotification(id);
    }
  };

  const deleteAlarm = async (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
            setAlarms(updatedAlarms);
            await saveAlarms(updatedAlarms);
            await notifee.cancelTriggerNotification(id);
          },
        },
      ],
    );
  };

  const renderAlarm = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <View style={styles.alarmTimeContainer}>
        <Text style={styles.alarmTime}>{item.time}</Text>
        <View style={styles.daysContainer}>
          {DAYS.map(day => (
            <Text
              key={day}
              style={[
                styles.dayText,
                item.days.includes(day) && styles.selectedDay,
              ]}>
              {day}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.alarmActions}>
        <Switch
          value={item.isEnabled}
          onValueChange={() => toggleAlarm(item.id)}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteAlarm(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarms</Text>
      </View>

      <FlatList
        data={alarms}
        renderItem={renderAlarm}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.alarmList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowTimePicker(true)}>
        <MaterialIcons name="add-alarm" size={24} color="#FFF" />
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (event.type === 'set' && date) {
              // Create the alarm with the date directly from the picker
              const newAlarm: Alarm = {
                id: Date.now().toString(),
                time: format(date, 'HH:mm'),
                isEnabled: true,
                puzzleType: 'math',
                days: [],
              };

              // Update state and create notification
              setAlarms(prevAlarms => {
                const updatedAlarms = [...prevAlarms, newAlarm];
                // Save alarms and create notification after state update
                saveAlarms(updatedAlarms);
                createTriggerNotification(newAlarm);
                return updatedAlarms;
              });
            }
          }}
        />
      )}
    </View>
  );
};

export default AlarmScreen; 