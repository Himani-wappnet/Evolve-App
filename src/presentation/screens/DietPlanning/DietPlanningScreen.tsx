import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Easing,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../../constants/colors';
import { Dimens } from '../../../constants/dimens';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Toast from '../../../components/Toast';
import * as Animatable from 'react-native-animatable';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from './Styles';
import { Meal } from '../../../domain/models/Meal';
import { MealRepositoryImpl } from '../../../data/repositories/MealRepositoryImpl';
import { useDietPlanningViewModel } from '../../viewmodels/DietPlanningViewModel';

const Icon = MaterialIcons as any;
const screenWidth = Dimensions.get('window').width;

interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

interface NavigationProps {
  navigate: (screen: string) => void;
  goBack: () => void;
}

interface DietOption {
  id: string;
  title: string;
  description: string;
  options: string[];
  selectedOption: string;
}

const initialDietOptions: DietOption[] = [
  {
    id: 'dietType',
    title: 'Choose Your Diet Type',
    description: 'Select the type of diet you want to follow',
    options: ['Balanced', 'Keto', 'Vegetarian', 'Vegan', 'Paleo', 'Mediterranean'],
    selectedOption: '',
  },
  {
    id: 'goal',
    title: 'What\'s Your Goal?',
    description: 'What do you want to achieve with your diet?',
    options: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Better Health'],
    selectedOption: '',
  },
  {
    id: 'restrictions',
    title: 'Any Dietary Restrictions?',
    description: 'Select any dietary restrictions you have',
    options: ['None', 'Gluten-Free', 'Lactose-Free', 'Nut-Free', 'Shellfish-Free'],
    selectedOption: '',
  },
  {
    id: 'activity',
    title: 'Activity Level',
    description: 'How active are you on a daily basis?',
    options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
    selectedOption: '',
  },
  {
    id: 'meals',
    title: 'Meals Per Day',
    description: 'How many meals do you prefer to have?',
    options: ['3 Meals', '4 Meals', '5 Meals', '6 Meals'],
    selectedOption: '',
  },
];

const DietPlanningScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const mealRepository = new MealRepositoryImpl();
  const {
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
  } = useDietPlanningViewModel(mealRepository);

  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState(new Date());

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
const slideAnim1 = useRef(new Animated.Value(30)).current;
const scaleAnim1 = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchMeals();
  }, [selectedDay]);

  useEffect(() => {
    if (showMainScreen) {
      generateRecommendedMeals();
    }
  }, [showMainScreen]);

  useEffect(() => {
    fetchDietPreferences();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDietPreferences();
    }, [])
  );

  // Initialize diet options if not already set
  useEffect(() => {
    if (!dietOptions || dietOptions.length === 0) {
      setDietOptions(initialDietOptions);
    }
  }, []);

  const handleOptionSelect = (option: string) => {
    const updatedOptions = dietOptions.map((item, index) => {
      if (index === currentStep) {
        return {
          ...item,
          selectedOption: option
        };
      }
      return item;
    });
    setDietOptions(updatedOptions);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim1, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim1, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);  

  const handleNext = () => {
    if (currentStep < dietOptions.length - 1) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(screenWidth);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      saveDietPreferences();
      setShowMainScreen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-screenWidth);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedTime(date);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setNewMeal(prev => ({ ...prev, time: `${hours}:${minutes}` }));
    }
  };

  const formatTimeWithAMPM = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleCloseAddModal = () => {
    setNewMeal({ name: '', calories: '', time: '' });
    setShowAddMealModal(false);
  };

  const handleCloseEditModal = () => {
    setNewMeal({ name: '', calories: '', time: '' });
    setSelectedMeal(null);
    setShowEditMealModal(false);
  };

  const openEditModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setNewMeal({
      name: meal.name,
      calories: meal.calories.toString(),
      time: meal.time,
    });
    setShowEditMealModal(true);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  // Add safety check for current step
  const currentDietOption = dietOptions[currentStep] || initialDietOptions[0];

  if (!showMainScreen) {
    return (
      <View style={styles.onboardingContainer}>
        <LinearGradient
          colors={['#6C63FF', '#4A42E6']}
          style={styles.onboardingHeader}
        >
          <Text style={styles.onboardingTitle}>{currentDietOption.title}</Text>
          <Text style={styles.onboardingDescription}>{currentDietOption.description}</Text>
        </LinearGradient>

        <Animated.View
          style={[
            styles.optionsContainer,
            {
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {currentDietOption.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                currentDietOption.selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  currentDietOption.selectedOption === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={styles.progressContainer}>
          {dietOptions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.activeProgressDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={handleBack}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              !currentDietOption.selectedOption && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!currentDietOption.selectedOption}
          >
            <Text style={styles.navButtonText}>
              {currentStep === dietOptions.length - 1 ? 'Finish' : 'Next'}
            </Text>
            <Icon name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F5F5F5']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#4A4A4A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diet Planning</Text>
        <TouchableOpacity 
          style={styles.headerAddButton}
          onPress={() => setShowAddMealModal(true)}
          testID="add-meal-button"
        >
          <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Animated.View
          style={[
            styles.caloriesCard,
            {
              opacity: fadeAnim1,
              transform: [
                { translateY: slideAnim1 },
                { scale: scaleAnim1 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#6C63FF', '#4A42E6']}
            style={styles.caloriesCardGradient}
          >
            <Text style={styles.caloriesTitle}>Daily Calories</Text>
            <Text style={styles.caloriesValue}>{totalCalories}</Text>
            <Text style={styles.caloriesSubtitle}>Target: 2000 kcal</Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((totalCalories / 2000) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>
        </Animated.View>
        {showRecommendations && (
          <Animated.View
            style={[
              styles.recommendationsContainer,
              {
                opacity: recommendationAnim,
                transform: [
                  {
                    translateY: recommendationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.recommendationsTitle}>Recommended Meals</Text>
            <Text style={styles.recommendationsSubtitle}>
              Based on your preferences: {dietOptions.map(opt => opt.selectedOption).join(', ')}
            </Text>
            
            {recommendedMeals.map((meal, index) => (
              <Animatable.View
                key={meal.id}
                animation="fadeInUp"
                delay={index * 200}
                duration={600}
                style={styles.recommendedMealCard}
              >
                <View style={styles.mealImageContainer}>
                  <Image
                    source={{ uri: meal.image }}
                    style={styles.mealImage}
                  />
                  <View style={styles.mealCategory}>
                    <Text style={styles.mealCategoryText}>{meal.category}</Text>
                  </View>
                </View>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealNameText}>{meal.name}</Text>
                  <Text style={styles.mealDescription}>{meal.description}</Text>
                  <View style={styles.mealInfoContainer}>
                    <View style={styles.mealInfoItem}>
                      <Icon name="local-fire-department" size={16} color="#6C63FF" />
                      <Text style={styles.mealInfoText}>{meal.calories} kcal</Text>
                    </View>
                    <View style={styles.mealInfoItem}>
                      <Icon name="access-time" size={16} color="#6C63FF" />
                      <Text style={styles.mealInfoText}>{meal.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.addMealButton}
                    onPress={() => {
                      setNewMeal({
                        name: meal.name,
                        calories: meal.calories.toString(),
                        time: meal.time,
                      });
                      setShowAddMealModal(true);
                    }}
                  >
                    <Text style={styles.addMealButtonText}>Add to Plan</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))}
          </Animated.View>
        )}

        <View style={styles.daySelector}>
          {['Yesterday', 'Today', 'Tomorrow'].map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDayButton,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.selectedDayButtonText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C63FF" testID="loading-indicator"/>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.mealsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {meals.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="restaurant" size={48} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>No meals added yet</Text>
              </View>
            ) : (
              meals.map((meal, index) => (
                <Animatable.View
                key={meal.id}
                animation="fadeInUp"
                delay={index * 100}
                duration={600}
                style={styles.mealCard}
              >
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealNameText}>{meal.name}</Text>
                    <Text style={styles.mealTime}>{formatTimeWithAMPM(meal.time)}</Text>
                    <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                  </View>
                  <View style={styles.mealActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openEditModal(meal)}
                      testID="edit-meal-button"
                    >
                      <Icon name="edit" size={20} color="#6C63FF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMeal(meal.id)}
                      testID="delete-meal-button"
                    >
                      <Icon name="delete" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              ))
            )}
          </Animated.View>
        )}
      </ScrollView>

      <Modal
        visible={showAddMealModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAddModal}
      >
        <Animatable.View 
          animation="fadeIn"
          duration={300}
          style={styles.modalOverlay}
        >
          <Animatable.View 
            animation="slideInUp"
            duration={400}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Meal</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseAddModal}
              >
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Icon name="restaurant" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Meal Name"
                  placeholderTextColor="#999999"
                  value={newMeal.name}
                  onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="local-fire-department" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Calories"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={newMeal.calories}
                  onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="access-time" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowTimePicker(true)}
                  testID="time-picker-button"
                >
                  <Text
      style={[
        styles.timeInputText,
        { color: newMeal.time ? '#4A4A4A' : "#999999" }
      ]}
    >
                    {newMeal.time || 'Select Time'}
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomDateTimePicker
                visible={showTimePicker}
                value={selectedTime}
                mode="time"
                onChange={handleTimeChange}
                onClose={() => setShowTimePicker(false)}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseAddModal}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalAddButton]}
                onPress={handleAddMeal}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" testID="loading-indicator"/>
                ) : (
                  <>
                    <Icon name="add-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.addButtonText}>Add Meal</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </Animatable.View>
      </Modal>

      <Modal
        visible={showEditMealModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseEditModal}
      >
        <Animatable.View 
          animation="fadeIn"
          duration={300}
          style={styles.modalOverlay}
        >
          <Animatable.View 
            animation="slideInUp"
            duration={400}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Meal</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseEditModal}
              >
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Icon name="restaurant" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Meal Name"
                  placeholderTextColor="#999999"
                  value={newMeal.name}
                  onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="local-fire-department" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Calories"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={newMeal.calories}
                  onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="access-time" size={20} color="#6C63FF" style={styles.inputIcon} />
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowTimePicker(true)}
                  testID="time-picker-button"
                >
                  <Text style={styles.timeInputText}>
                    {newMeal.time || 'Select Time'}
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomDateTimePicker
                visible={showTimePicker}
                value={selectedTime}
                mode="time"
                onChange={handleTimeChange}
                onClose={() => setShowTimePicker(false)}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseEditModal}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalAddButton]}
                onPress={handleEditMeal}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" testID="loading-indicator"/>
                ) : (
                  <>
                    <Icon name="save" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.addButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </Animatable.View>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
};
export default DietPlanningScreen; 