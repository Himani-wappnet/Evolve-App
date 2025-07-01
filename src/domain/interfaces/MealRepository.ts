import { DietPreferences, Meal, RecommendedMeal } from "../models/Meal";

export interface MealRepository {
  getMeals(day: string): Promise<Meal[]>;
  addMeal(meal: Omit<Meal, 'id'>): Promise<string>;
  updateMeal(meal: Meal): Promise<void>;
  deleteMeal(mealId: string): Promise<void>;
  getDietPreferences(): Promise<DietPreferences | null>;
  saveDietPreferences(preferences: Omit<DietPreferences, 'id'>): Promise<void>;
  generateRecommendedMeals(preferences: DietPreferences): Promise<RecommendedMeal[]>;
} 