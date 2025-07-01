import firestore from '@react-native-firebase/firestore';
import { MealRepository } from '../../domain/interfaces/MealRepository';
import { DietPreferences, Meal, RecommendedMeal } from '../../domain/models/Meal';

export class MealRepositoryImpl implements MealRepository {
  private readonly userId = 'current-user-id'; // Replace with actual user ID from auth context

  async getMeals(day: string): Promise<Meal[]> {
    const snapshot = await firestore()
      .collection('meals')
      .where('day', '==', day)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Meal[];
  }

  async addMeal(meal: Omit<Meal, 'id'>): Promise<string> {
    const docRef = await firestore()
      .collection('meals')
      .add({
        ...meal,
        userId: this.userId,
      });

    return docRef.id;
  }

  async updateMeal(meal: Meal): Promise<void> {
    await firestore()
      .collection('meals')
      .doc(meal.id)
      .update({
        name: meal.name,
        calories: meal.calories,
        time: meal.time,
      });
  }

  async deleteMeal(mealId: string): Promise<void> {
    await firestore()
      .collection('meals')
      .doc(mealId)
      .delete();
  }

  async getDietPreferences(): Promise<DietPreferences | null> {
    const snapshot = await firestore()
      .collection('dietPreferences')
      .where('userId', '==', this.userId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const preferences = snapshot.docs
      .sort((a, b) => {
        const dateA = a.data().createdAt?.toDate() || new Date(0);
        const dateB = b.data().createdAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })[0]
      .data() as DietPreferences;

    return preferences;
  }

  async saveDietPreferences(preferences: Omit<DietPreferences, 'id'>): Promise<void> {
    await firestore()
      .collection('dietPreferences')
      .add({
        ...preferences,
        userId: this.userId,
        createdAt: new Date(),
      });
  }

  async generateRecommendedMeals(preferences: DietPreferences): Promise<RecommendedMeal[]> {
    // This is a mock implementation - in a real app, you'd use the preferences to generate recommendations
    return [
      {
        id: '1',
        name: 'Protein Breakfast Bowl',
        calories: 450,
        time: '08:00',
        category: 'Breakfast',
        description: 'High protein breakfast with avocado, and whole grain toast',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: '2',
        name: 'Quinoa Salad',
        calories: 350,
        time: '12:00',
        category: 'Lunch',
        description: 'Fresh quinoa salad with vegetables and lean protein',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: '3',
        name: 'Grilled Salmon',
        calories: 500,
        time: '18:00',
        category: 'Dinner',
        description: 'Grilled salmon with steamed vegetables and brown rice',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      },
    ];
  }
} 