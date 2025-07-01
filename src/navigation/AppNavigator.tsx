import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screens/LoginScreen/LoginScreen";
import SignupPage from "../screens/SignupScreen/SignUpScreen";
import Dashboard from "../screens/Dashboard/Dashboard";
// import CreateHabitScreen from "../screens/CreateHabit/CreateHabitScreen";
// import HabitDetailScreen from '../screens/HabitDetail/HabitDetailScreen';
// import AlarmScreen from "../screens/Alarm/AlarmScreen";
// import PuzzleScreen from "../screens/Alarm/PuzzleScreen";
import CreateHabitScreen from "../presentation/screens/CreateHabit/CreateHabitScreen";
import HabitDetailScreen from "../presentation/screens/HabitDetail/HabitDetailScreen";
import DailyDairyScreen from "../presentation/screens/DailyDairy/DailyDairyScreen";
import MyDairyScreen from "../presentation/screens/MyDairy/MyDairyScreen";
import EditDiaryScreen from "../presentation/screens/EditDiary/EditDiaryScreen";
import DiaryDetailScreen from "../presentation/screens/DiaryDetail/DiaryDetailScreen";
import notifee, { EventType } from "@notifee/react-native";
import AlarmScreen from "../presentation/screens/Alarm/AlarmScreen";
import PuzzleScreen from "../presentation/screens/Puzzle/PuzzleScreen";
import MobileAddictionScreen from "../presentation/screens/MobileAddiction/MobileAddictionScreen";
import DietPlanningScreen from "../presentation/screens/DietPlanning/DietPlanningScreen";
import WelcomeScreen from "../presentation/screens/Welcome/WelcomeScreen";
import LoginScreen from "../presentation/screens/Login/LoginScreen";
import SignUpScreen from "../presentation/screens/SignUp/SignUpScreen";

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginPage: undefined;
  Walkthrough: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
  GetStartPage: undefined;
  Dashboard: undefined;
  HabitDetail: undefined;
  CreateHabit: undefined;  
  DailyDairy: undefined;  
  TaskDetail: { taskId?: string };
  EditTaskDetail: { taskId: string };
  AlarmScreen: undefined;
  PuzzleScreen: { alarmId: string };
  MyDairyScreen: undefined;
  DiaryDetail: { taskId: string };
  MobileAddiction: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = ({ navigationRef }: { navigationRef: any }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPage" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="CreateHabit" component={CreateHabitScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DailyDairy" component={DailyDairyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyDairyScreen" component={MyDairyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditTask" component={EditDiaryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlarmScreen" component={AlarmScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} options={{ headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false, // iOS back button  
         }} />
        <Stack.Screen name="DiaryDetail" component={DiaryDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MobileAddiction" component={MobileAddictionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DietPlanning" component={DietPlanningScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
