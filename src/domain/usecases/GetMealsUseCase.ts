import { MealRepository } from "../interfaces/MealRepository";
import { Meal } from "../models/Meal";

export class GetMealsUseCase {
  constructor(private mealRepository: MealRepository) {}

  async execute(day: string): Promise<Meal[]> {
    return this.mealRepository.getMeals(day);
  }
} 