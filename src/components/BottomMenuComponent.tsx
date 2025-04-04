import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, TouchableOpacity, StyleSheet, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import { icons } from "../constants/images";
import LoginPage from "../screens/LoginScreen/LoginScreen";
import SignupPage from "../screens/SignupScreen/SignUpScreen";
// import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import { Strings } from "../constants/strings";
import { Dimens } from "../constants/dimens";
import { Colors } from "../constants/colors";
import HomeScreen from "../presentation/screens/Home/HomeScreen";

// Define the navigation type
// type RootStackParamList = {
//   HomePage: undefined;
//   CreateHabit: undefined;
//   Wishlist: undefined;
//   FloatingButton: undefined;
// };

const Tab = createBottomTabNavigator();

const FloatingShopButton: React.FC = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [isNestedVisible, setIsNestedVisible] = useState(false);

  const toggleModal = () => setIsVisible(!isVisible);
  const toggleNestedModal = () => setIsNestedVisible(!isNestedVisible);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        testID="floating-shop-button"
        activeOpacity={0.7}
        onPress={toggleModal}
      >
        <View style={styles.fabInner}>
          <Image
            source={icons.IC_BOTTOMMENU_CARTUNSELECT}
            style={styles.fabIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>

            <TouchableOpacity style={styles.option}
             onPress={() => {
              toggleModal(); 
              navigation.navigate("TaskDetail");
            }}
             >
              <Text style={styles.bottomText}>{Strings.Daily_Dairy}</Text>
            </TouchableOpacity>

            {/* Open Nested Bottom Sheet */}
            <TouchableOpacity style={styles.option} onPress={toggleNestedModal}>
              <Text style={styles.bottomText}>{Strings.Create_Custom_Habit}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Text style={styles.bottomText}>{Strings.Create_Diet_Plan}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}
            //  onPress={() => {
            //   toggleModal(); 
            //   navigation.navigate("AlarmScreen");
            // }}
            >
              <Text style={styles.bottomText}>{Strings.Puzzle_Alarm_System}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
       
      </Modal>

      {/* Nested Bottom Sheet for "Create Custom Habit" */}
      {/* <Modal
        visible={isNestedVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleNestedModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.nestedBottomSheet}>
            <TouchableOpacity style={styles.nestedOption}>
              <Text style={styles.nestedText}>Quit Bad Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nestedOption}>
              <Text style={styles.nestedText}>New Good Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nestedOption}>
              <Text style={styles.nestedText}>Add Mood</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={toggleNestedModal}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <Modal
        visible={isNestedVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleNestedModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>

            {/* Row 1 - Quit Bad Habit & New Good Habit */}
            <View style={styles.row}>
              <TouchableOpacity style={[styles.card, styles.quitHabit]}>
                <Text style={styles.title}>Quit Bad Habit</Text>
                <Text style={styles.description}>Never too late...</Text>
                <View style={styles.iconContainer}>
                  <Text style={styles.crossIcon}>✖️</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
              style={[styles.card, styles.goodHabit]}
              onPress={() => {
                toggleNestedModal(); // Close Nested Modal
                toggleModal(); // Close Main Modal
                navigation.navigate("CreateHabit");
              }}
               >
                <Text style={styles.title}>New Good Habit</Text>
                <Text style={styles.description}>For a better life</Text>
                <View style={styles.iconContainer}>
                  <Text style={styles.checkIcon}>✔️</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Row 2 - Add Mood */}
            <TouchableOpacity style={[styles.card, styles.mood]}>
              <Text style={styles.title}>Add Mood</Text>
              <Text style={styles.description}>How're you feeling?</Text>
              <View style={styles.emojiContainer}>
                {['😀', '😎', '😢', '😠', '😍'].map((emoji, index) => (
                  <Text key={index} style={styles.emoji}>{emoji}</Text>
                ))}
              </View>
            </TouchableOpacity>

            {/* Floating Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleNestedModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Define props interface for BottomNavigation
interface BottomNavigationProps {
  testID?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ testID }) => {
  return (
    <View testID={testID} style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="HomePage"
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomePage"
          component={HomeScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
                Home
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                testID={focused ? "home-icon-active" : undefined}
                source={icons.IC_BOTTOMMENU_HOMEUNSELECT}
                style={[styles.icon, focused && styles.iconFocused]}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="FloatingButton"
          component={SignupPage}
          options={{
            tabBarButton: () => <FloatingShopButton />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
                Profile
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                testID={focused ? "profile-icon-active" : undefined}
                source={icons.IC_BOTTOMMENU_SETTINGUNSELECT}
                style={[styles.icon, focused && styles.iconFocused]}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 70,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#000000",
  },
  iconFocused: {
    tintColor: Colors.primary,
  },
  fab: {
    // width: 54,
    // height: 56,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: hp('3%'),
    alignSelf: "center",
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  bottomSheetHabit: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  nestedBottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  nestedOption: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 10,
  },
  nestedText: {
    color: "#002055",
    fontSize: Dimens.fontSize.FONTSIZE_16,
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp('3%')
  },
  closeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  option: {
    width: "100%",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    marginTop: hp('1%'),
    borderRadius: 10
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#000",
  },
  tabBarLabelFocused: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  bottomText: {
    color: '#002055',
    fontSize: Dimens.fontSize.FONTSIZE_16,
    fontWeight: "500"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "48%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
  },
  quitHabit: {
    borderColor: "#FFCDD2",
    borderWidth: 2,
  },
  goodHabit: {
    borderColor: "#C8E6C9",
    borderWidth: 2,
  },
  mood: {
    width: "100%",
    borderColor: "#FFF9C4",
    borderWidth: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  emoji: {
    fontSize: 18,
  },
  iconContainer: {
    // position: "absolute",
    // right: 10,
    // top: 10,
  },
  crossIcon: {
    color: "#F44336",
    fontSize: 18,
  },
  checkIcon: {
    color: "#4CAF50",
    fontSize: 18,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default BottomNavigation;
