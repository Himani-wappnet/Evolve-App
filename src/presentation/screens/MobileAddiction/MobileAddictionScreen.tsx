import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimens } from '../../../constants/dimens';
import { BarChart } from 'react-native-chart-kit';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Icon = MaterialIcons as any;
const { AdminModule, UsageStatsModule, UsageAccessModule } = NativeModules;
const screenWidth = Dimensions.get('window').width;

interface UsageData {
  rawInSeconds: number;
  minutes: number;
  hours: number;
  seconds: number;
  packageName: string;
  date?: string;
  icon?: string;
}

const getAppName = (packageName: string): string => {
  // Convert package names to readable names
  const appNames: { [key: string]: string } = {
    'com.google.android.youtube': 'YouTube',
    'com.whatsapp': 'WhatsApp',
    'com.instagram.android': 'Instagram',
    'com.snapchat.android': 'Snapchat',
    'com.android.chrome': 'Chrome',
    'com.google.android.apps.maps': 'Google Maps',
    'com.microsoft.teams': 'Teams',
    'com.evolve': 'Evolve',
    'com.getsomeheadspace.android': 'Headspace',
    'com.android.vending': 'Play Store',
    'com.oneplus.gallery': 'Photos',
    'com.android.settings': 'Settings',
    'the.hexcoders.whatsdelete': 'WhatsDelete',
  };
  
  return appNames[packageName] || packageName.split('.').pop() || packageName;
};

const formatDuration = (hours: number, minutes: number): string => {
  if (hours > 0) {
    return `${hours} hrs, ${minutes} min`;
  }
  return `${minutes} minutes`;
};

const MobileAddictionScreen = () => {
  const navigation = useNavigation();
  const [showAdminPopup, setShowAdminPopup] = useState(true);
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageData[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState({ hours: 0, minutes: 0 });
  const [itemAnimations, setItemAnimations] = useState<Animated.Value[]>([]);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <-- new
  const [weeklyData, setWeeklyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0]
    }]
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {

    const checkAdminStatus = async () => {
      const adminFlag = await AsyncStorage.getItem('adminEnabled');
      if (adminFlag === 'true') {
        setIsAdminEnabled(true);
        setShowAdminPopup(false); // Don't show popup
      } else {
        setShowAdminPopup(true); // Show popup until user enables
      }
      setIsLoading(false); 
    };
  
    checkAdminStatus();
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    if (Platform.OS === 'android') {
      UsageAccessModule.isUsageAccessGranted()
        .then((granted: boolean) => {
          if (!granted) {
            UsageAccessModule.openUsageAccessSettings();
          } else {
            fetchUsageStats();
          }
        })
        .catch((err: any) => {
          console.warn("Error checking usage access", err);
        });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartVisible(true);
    }, 2000);
  
    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  const fetchUsageStats = () => {
    
    UsageStatsModule.getUsageStats({}, (err: any, result: any) => {
      if (err) {
        console.warn("Error getting stats", err);
      } else {
        setIsLoading(false); 
        // Filter out system apps and sort by usage time
        const filteredStats = result
          .filter((stat: UsageData) => stat.rawInSeconds > 0)
          .sort((a: UsageData, b: UsageData) => b.rawInSeconds - a.rawInSeconds);

          const totalSeconds = filteredStats.reduce(
            (acc: number, curr: UsageData) => acc + curr.rawInSeconds,
            0
          );
          
          const totalMinutes = Math.round(totalSeconds / 60); // Convert to minutes
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          
          setTotalScreenTime({ hours: totalHours, minutes: remainingMinutes });
          setUsageStats(filteredStats);

          // Calculate exact hours with decimals (e.g., 3.5 for 3h 30m)
          const totalHoursDecimal = Number((totalSeconds / 3600).toFixed(2));

          setWeeklyData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [totalHoursDecimal, 0, 0, 0, 0, 0, 0]
            }]
          });

          const animations: Animated.Value[] = filteredStats.map(() => new Animated.Value(100));
          setItemAnimations(animations);
    
          // Animate slide-in from right one by one
          Animated.stagger(100,
            animations.map(anim =>
              Animated.timing(anim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp)
              })
            )
          ).start();
          // setIsLoading(true); 
      }
    });
  };

  const handleEnableAdmin = async () => {
    try {
      await AdminModule.activateAdmin();
      await AsyncStorage.setItem('adminEnabled', 'true'); // store it
      setIsAdminEnabled(true);
      setShowAdminPopup(false);
      Alert.alert('Success', 'Admin access has been enabled');
      fetchUsageStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to enable admin access');
    }
  };

  const filteredStats = Object.values(
    usageStats.reduce((acc: { [key: string]: UsageData }, curr: UsageData) => {
      const existing = acc[curr.packageName];
      if (!existing || curr.rawInSeconds > existing.rawInSeconds) {
        acc[curr.packageName] = curr;
      }
      return acc;
    }, {} as { [key: string]: UsageData })
  );

  const maxHours = weeklyData?.datasets?.[0]?.data?.length
  ? Math.max(...weeklyData.datasets[0].data)
  : 0;

// Round to the nearest whole number or half
const safeMax = Math.ceil(maxHours);

  return (
    <View style={styles.container}>
      {!isLoading && showAdminPopup && (
      <Modal
        visible={showAdminPopup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdminPopup(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Access Required</Text>
            <Text style={styles.modalText}>
              To control mobile usage, this app needs admin access. This will allow the app to:
            </Text>
            <Text style={styles.modalBullet}>• Monitor app usage</Text>
            <Text style={styles.modalBullet}>• Track screen time</Text>
            <Text style={styles.modalBullet}>• View detailed usage statistics</Text>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={handleEnableAdmin}
            >
              <Text style={styles.adminButtonText}>Enable Admin Access</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      )}

      <View style={styles.header}>
        <TouchableOpacity testID="header-back-button" onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity details</Text>
        <TouchableOpacity onPress={() => {}}>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* <Animated.View 
          style={[
            styles.screenTimeContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        > */}
        <View style={styles.screenTimeContainer}>
          <View style={{flexDirection:'row'}}>
          <Text style={[styles.screenTimeLabel, { color: Colors.text }]}>Screen time : </Text>
          <Text style={styles.screenTimeValue}>
            {totalScreenTime.hours} hrs, {totalScreenTime.minutes} min
          </Text>
          </View>
          <Text style={styles.screenTimeSubtext}>Today</Text>
          </View>
        <View style={styles.chartContainer}>
       
{isChartVisible ? (

          <BarChart
            data={weeklyData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix="h"
            fromZero={true}
            segments={safeMax}
            flatColor={true}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                paddingRight: 0,
              },
              barPercentage: 0.6,
              formatYLabel: (value: string) => `${Math.round(Number(value))}`,
            }}
            style={{
              borderRadius: 16,
            }}
          />
                  ) : (
  <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingMoreContainer}/>
)}
    </View>

        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View style={styles.appList}>
            {filteredStats.map((stat: UsageData, index) => (
                <Animated.View
                key={index}
                style={[
                  styles.appItem,
                  {
                    transform: [{
                      translateX: itemAnimations[index] || new Animated.Value(0)
                    }],
                    opacity: fadeAnim
                  }
                ]}
              >
                <View style={styles.appInfo}>
                  <View>
                    {stat.icon ? (
                      <Image
                        source={{ uri: `data:image/png;base64,${stat.icon}` }}
                        style={styles.appIcon}
                      />
                    ) : (
                      <View style={styles.placeholderIcon}>
                        <Text>📱</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.appDetails}>
                    <Text style={styles.appName}>{getAppName(stat.packageName)}</Text>
                    <Text style={styles.appTime}>
                      {formatDuration(stat.hours, stat.minutes)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.timerIcon}>
                  <Text>⌛</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingMoreContainer: {
    // padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  
  appDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalBullet: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  adminButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  adminButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    // marginBottom: 20,
  },
  screenTimeContainer: {
    padding:12,
    alignItems: 'center',
    marginBottom: hp("2%"),
    // flexDirection:'row',
    // justifyContent:'space-between'
  },
  screenTimeLabel: {
    fontSize: Dimens.fontSize.FONTSIZE_16,
    fontWeight: '600',
  },
  screenTimeValue: {
    fontSize: Dimens.fontSize.FONTSIZE_18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  screenTimeSubtext: {
    fontSize: 16,
    color: Colors.primary,
    opacity: 0.7,
    textDecorationLine:'underline'
  },
  appList: {
    flex: 1,
    padding: 16,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  appName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  appTime: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.7,
  },
  timerIcon: {
    padding: 10,
  },
  chartContainer: {
    alignSelf: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default MobileAddictionScreen; 