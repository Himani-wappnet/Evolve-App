import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { DietOption, DietPreferences, Meal, RecommendedMeal } from '../../domain/models/Meal';
import { MealRepository } from '../../domain/interfaces/MealRepository';
import { GetMealsUseCase } from '../../domain/usecases/GetMealsUseCase';

export const useDietPlanningViewModel = (mealRepository: MealRepository) => {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showEditMealModal, setShowEditMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [dietOptions, setDietOptions] = useState<DietOption[]>([]);
  const [showMainScreen, setShowMainScreen] = useState(false);
  const [dietPreferences, setDietPreferences] = useState<DietPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [recommendedMeals, setRecommendedMeals] = useState<RecommendedMeal[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const recommendationAnim = useRef(new Animated.Value(0)).current;
  const animatedMealValues = useRef<Animated.Value[]>([]).current;

  const getMealsUseCase = new GetMealsUseCase(mealRepository);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const fetchedMeals = await getMealsUseCase.execute(selectedDay);
      setMeals(fetchedMeals);
    } catch (error) {
      setToast({
        message: 'Failed to load meals. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name.trim() || !newMeal.calories.trim() || !newMeal.time.trim()) {
      setToast({
        message: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);
    try {
      const mealData = {
        name: newMeal.name.trim(),
        calories: parseInt(newMeal.calories),
        time: newMeal.time.trim(),
        day: selectedDay,
        userId: 'current-user-id',
        createdAt: new Date(),
      };

      await mealRepository.addMeal(mealData);
      setMeals(prev => [...prev, { ...mealData, id: 'temp-id' }]);
      setNewMeal({ name: '', calories: '', time: '' });
      setShowAddMealModal(false);
      setToast({
        message: 'Meal added successfully!',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to add meal. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMeal = async () => {
    if (!selectedMeal || !newMeal.name.trim() || !newMeal.calories.trim() || !newMeal.time.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedMeal = {
        ...selectedMeal,
        name: newMeal.name.trim(),
        calories: parseInt(newMeal.calories),
        time: newMeal.time.trim(),
      };

      await mealRepository.updateMeal(updatedMeal);
      setMeals(meals.map(meal => 
        meal.id === selectedMeal.id ? updatedMeal : meal
      ));
      setShowEditMealModal(false);
      setSelectedMeal(null);
      setNewMeal({ name: '', calories: '', time: '' });
      setToast({
        message: 'Meal updated successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to update meal. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      setIsLoading(true);
      await mealRepository.deleteMeal(mealId);
      setMeals(meals.filter(meal => meal.id !== mealId));
      setToast({
        message: 'Meal deleted successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to delete meal. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDietPreferences = async () => {
    try {
      setIsLoadingPreferences(true);
      const preferences = await mealRepository.getDietPreferences();
      setDietPreferences(preferences);
    } catch (error) {
      setToast({
        message: 'Failed to load diet preferences',
        type: 'error',
      });
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const saveDietPreferences = async () => {
    try {
      setIsSaving(true);
      const preferences = {
        dietType: dietOptions.find(opt => opt.id === 'dietType')?.selectedOption || '',
        goal: dietOptions.find(opt => opt.id === 'goal')?.selectedOption || '',
        restrictions: dietOptions.find(opt => opt.id === 'restrictions')?.selectedOption || '',
        activity: dietOptions.find(opt => opt.id === 'activity')?.selectedOption || '',
        meals: dietOptions.find(opt => opt.id === 'meals')?.selectedOption || '',
        userId: 'current-user-id',
        createdAt: new Date(),
      };

      await mealRepository.saveDietPreferences(preferences);
      setDietPreferences(preferences);
      setToast({
        message: 'Diet preferences saved successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to save diet preferences',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateRecommendedMeals = async () => {
    if (!dietPreferences) return;

    try {
      const recommendations = await mealRepository.generateRecommendedMeals(dietPreferences);
      setRecommendedMeals(recommendations);
      setShowRecommendations(true);

      Animated.spring(recommendationAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } catch (error) {
      setToast({
        message: 'Failed to generate recommendations',
        type: 'error',
      });
    }
  };

  return {
    selectedDay,
    setSelectedDay,
    meals,
    showAddMealModal,
    setShowAddMealModal,
    showEditMealModal,
    setShowEditMealModal,
    selectedMeal,
    setSelectedMeal,
    newMeal,
    setNewMeal,
    isLoading,
    isSaving,
    toast,
    setToast,
    currentStep,
    setCurrentStep,
    dietOptions,
    setDietOptions,
    showMainScreen,
    setShowMainScreen,
    dietPreferences,
    isLoadingPreferences,
    recommendedMeals,
    showRecommendations,
    slideAnim,
    fadeAnim,
    scaleAnim,
    recommendationAnim,
    animatedMealValues,
    fetchMeals,
    handleAddMeal,
    handleEditMeal,
    handleDeleteMeal,
    fetchDietPreferences,
    saveDietPreferences,
    generateRecommendedMeals,
  };
}; 