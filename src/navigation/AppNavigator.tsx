import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screens/LoginScreen/LoginScreen";
import SignupPage from "../screens/SignupScreen/SignUpScreen";
import Dashboard from "../screens/Dashboard/Dashboard";
// import CreateHabitScreen from "../screens/CreateHabit/CreateHabitScreen";
// import HabitDetailScreen from '../screens/HabitDetail/HabitDetailScreen';
import DailyDairyScreen from "../screens/DailyDairy/DailyDairyScreen";
import TaskDetailScreen from "../screens/TaskDetail/TaskDetailScreen";
import EditDiaryScreen from "../screens/EditDiary/EditDiaryScreen";
import AlarmScreen from "../screens/Alarm/AlarmScreen";
import PuzzleScreen from "../screens/Alarm/PuzzleScreen";
import CreateHabitScreen from "../presentation/screens/CreateHabit/CreateHabitScreen";
import HabitDetailScreen from "../presentation/screens/HabitDetail/HabitDetailScreen";

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginPage: undefined;
  Walkthrough: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
  GetStartPage:undefined;
  Dashboard:undefined;
  HabitDetail: undefined;
  CreateHabit: undefined;  
  DailyDairy: undefined;  
  TaskDetail: undefined;
  EditTaskDetail: undefined;
  AlarmScreen: undefined;
  PuzzleScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer testID="app-navigator">
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPage" component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="CreateHabit" component={CreateHabitScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DailyDairy" component={DailyDairyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditTaskDetail" component={EditDiaryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlarmScreen" component={AlarmScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
