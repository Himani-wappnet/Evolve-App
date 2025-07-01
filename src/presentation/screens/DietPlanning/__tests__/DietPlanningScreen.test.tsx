import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import DietPlanningScreen from '../DietPlanningScreen';
import { MealRepositoryImpl } from '../../../../data/repositories/MealRepositoryImpl';

// Mock the dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-animatable', () => ({
  View: 'Animatable.View',
}));
jest.mock('../../../../components/Toast', () => 'Toast');
jest.mock('../../../../components/CustomDateTimePicker', () => 'CustomDateTimePicker');

// Mock the view model
const mockUseDietPlanningViewModel = jest.fn();
jest.mock('../../../viewmodels/DietPlanningViewModel', () => ({
  useDietPlanningViewModel: () => mockUseDietPlanningViewModel(),
}));

describe('DietPlanningScreen', () => {
  const mockMeals = [
    {
      id: '1',
      name: 'Breakfast',
      calories: 500,
      time: '08:00',
    },
    {
      id: '2',
      name: 'Lunch',
      calories: 800,
      time: '12:00',
    },
  ];

  const mockViewModel = {
    selectedDay: 'Today',
    setSelectedDay: jest.fn(),
    meals: mockMeals,
    showAddMealModal: false,
    setShowAddMealModal: jest.fn(),
    showEditMealModal: false,
    setShowEditMealModal: jest.fn(),
    selectedMeal: null,
    setSelectedMeal: jest.fn(),
    newMeal: { name: '', calories: '', time: '' },
    setNewMeal: jest.fn(),
    isLoading: false,
    isSaving: false,
    toast: null,
    setToast: jest.fn(),
    currentStep: 0,
    setCurrentStep: jest.fn(),
    dietOptions: [
      {
        id: 'dietType',
        title: 'Choose Your Diet Type',
        description: 'Select the type of diet you want to follow',
        options: ['Balanced', 'Keto', 'Vegetarian', 'Vegan', 'Paleo', 'Mediterranean'],
        selectedOption: '',
      },
    ],
    setDietOptions: jest.fn(),
    showMainScreen: true,
    setShowMainScreen: jest.fn(),
    recommendedMeals: [],
    showRecommendations: false,
    slideAnim: { setValue: jest.fn() },
    fadeAnim: { setValue: jest.fn() },
    scaleAnim: { setValue: jest.fn() },
    recommendationAnim: { interpolate: jest.fn() },
    animatedMealValues: {},
    fetchMeals: jest.fn(),
    handleAddMeal: jest.fn(),
    handleEditMeal: jest.fn(),
    handleDeleteMeal: jest.fn(),
    fetchDietPreferences: jest.fn(),
    saveDietPreferences: jest.fn(),
    generateRecommendedMeals: jest.fn(),
  };

  beforeEach(() => {
    mockUseDietPlanningViewModel.mockReturnValue(mockViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<DietPlanningScreen />);
    expect(getByText('Diet Planning')).toBeTruthy();
  });

  it('displays daily calories correctly', () => {
    const { getByText } = render(<DietPlanningScreen />);
    expect(getByText('Daily Calories')).toBeTruthy();
    expect(getByText('1300')).toBeTruthy(); // 500 + 800 from mock meals
  });

  it('handles day selection', () => {
    const { getByText } = render(<DietPlanningScreen />);
    const yesterdayButton = getByText('Yesterday');
    fireEvent.press(yesterdayButton);
    expect(mockViewModel.setSelectedDay).toHaveBeenCalledWith('Yesterday');
  });

  it('opens add meal modal when add button is pressed', () => {
    const { getByTestId } = render(<DietPlanningScreen />);
    const addButton = getByTestId('add-meal-button');
    fireEvent.press(addButton);
    expect(mockViewModel.setShowAddMealModal).toHaveBeenCalledWith(true);
  });

  it('displays meal cards correctly', () => {
    const { getByText } = render(<DietPlanningScreen />);
    expect(getByText('Breakfast')).toBeTruthy();
    expect(getByText('Lunch')).toBeTruthy();
    expect(getByText('500 kcal')).toBeTruthy();
    expect(getByText('800 kcal')).toBeTruthy();
  });

  it('handles meal deletion', async () => {
    const { getAllByTestId } = render(<DietPlanningScreen />);
    const deleteButtons = getAllByTestId('delete-meal-button');
    fireEvent.press(deleteButtons[0]);
    expect(mockViewModel.handleDeleteMeal).toHaveBeenCalledWith('1');
  });

  it('handles meal editing', async () => {
    const { getAllByTestId } = render(<DietPlanningScreen />);
    const editButtons = getAllByTestId('edit-meal-button');
    fireEvent.press(editButtons[0]);
    expect(mockViewModel.setSelectedMeal).toHaveBeenCalledWith(mockMeals[0]);
    expect(mockViewModel.setShowEditMealModal).toHaveBeenCalledWith(true);
  });

  it('shows loading indicator when loading', () => {
    mockUseDietPlanningViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });
    const { getByTestId } = render(<DietPlanningScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('handles time picker interaction', () => {
    mockUseDietPlanningViewModel.mockReturnValue({
      ...mockViewModel,
      showAddMealModal: true,
    });
    const { getByTestId } = render(<DietPlanningScreen />);
    const timePickerButton = getByTestId('time-picker-button');
    fireEvent.press(timePickerButton);
    // Add more specific time picker interaction tests if needed
  });

  it('displays empty state when no meals are present', () => {
    mockUseDietPlanningViewModel.mockReturnValue({
      ...mockViewModel,
      meals: [],
    });
    const { getByText } = render(<DietPlanningScreen />);
    expect(getByText('No meals added yet')).toBeTruthy();
  });

  it('handles diet preferences selection', () => {
    mockUseDietPlanningViewModel.mockReturnValue({
      ...mockViewModel,
      showMainScreen: false,
    });
    const { getByText } = render(<DietPlanningScreen />);
    const dietOption = getByText('Balanced');
    fireEvent.press(dietOption);
    expect(mockViewModel.setDietOptions).toHaveBeenCalled();
  });
}); 