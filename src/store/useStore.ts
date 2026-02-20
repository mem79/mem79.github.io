import { create } from 'zustand';
import { db } from '../lib/db';
import { Ingredient, Recipe, MealPlan, FridgeItem } from '../types';

interface AppState {
    ingredients: Ingredient[];
    recipes: Recipe[];
    mealPlans: MealPlan[];
    fridge: FridgeItem[];
    loading: boolean;

    fetchIngredients: () => Promise<void>;
    fetchRecipes: () => Promise<void>;
    fetchMealPlans: () => Promise<void>;
    fetchFridge: () => Promise<void>;

    addIngredient: (item: Omit<Ingredient, 'id'>) => Promise<void>;
    addRecipe: (item: Omit<Recipe, 'id' | 'createdAt'>) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    addToFridge: (item: Omit<FridgeItem, 'id'>) => Promise<void>;
    removeFromFridge: (id: string) => Promise<void>;

    addMealPlan: (item: Omit<MealPlan, 'id'>) => Promise<void>;
    removeMealPlan: (id: string) => Promise<void>;

    initialize: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    ingredients: [],
    recipes: [],
    mealPlans: [],
    fridge: [],
    loading: false,

    fetchIngredients: async () => {
        const list = await db.ingredients.getAll();
        set({ ingredients: list });
    },
    fetchRecipes: async () => {
        const list = await db.recipes.getAll();
        set({ recipes: list });
    },
    fetchMealPlans: async () => {
        const list = await db.mealPlans.getAll();
        set({ mealPlans: list });
    },
    fetchFridge: async () => {
        const list = await db.fridge.getAll();
        set({ fridge: list });
    },

    addIngredient: async (item) => {
        await db.ingredients.add(item);
        get().fetchIngredients();
    },
    addRecipe: async (item) => {
        await db.recipes.add(item);
        get().fetchRecipes();
    },
    toggleFavorite: async (id) => {
        await db.recipes.toggleFavorite(id);
        get().fetchRecipes();
    },
    addToFridge: async (item) => {
        await db.fridge.add(item);
        get().fetchFridge();
    },
    removeFromFridge: async (id) => {
        await db.fridge.delete(id);
        get().fetchFridge();
    },

    addMealPlan: async (item) => {
        await db.mealPlans.add(item);
        get().fetchMealPlans();
    },
    removeMealPlan: async (id) => {
        await db.mealPlans.delete(id);
        get().fetchMealPlans();
    },

    initialize: async () => {
        set({ loading: true });
        await Promise.all([
            get().fetchIngredients(),
            get().fetchRecipes(),
            get().fetchMealPlans(),
            get().fetchFridge(),
        ]);
        set({ loading: false });
    },
}));
