export interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  createdAt: Date;
  userId: string;
  day: string;
}

export interface RecommendedMeal {
  id: string;
  name: string;
  calories: number;
  time: string;
  category: string;
  description: string;
  image: string;
}

export interface DietPreferences {
  dietType: string;
  goal: string;
  restrictions: string;
  activity: string;
  meals: string;
  userId: string;
  createdAt: Date;
}

export interface DietOption {
  id: string;
  title: string;
  description: string;
  options: string[];
  selectedOption: string;
} 