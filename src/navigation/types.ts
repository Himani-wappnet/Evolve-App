export type RootStackParamList = {
    LoginPage: undefined;
    SignUpPage: undefined;
    GetStartPage: undefined;
    Dashboard: undefined;
    CreateHabit: {
        showToast?: boolean;
        toastMessage?: string;
        toastType?: 'success' | 'error';
    } | undefined;
    HabitDetail: {
        habitName: string;
        habitIcon: string;
        habitId?: string;
    };
};

export type MainTabParamList = {
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
}; 