import { Ingredient, Recipe, MealPlan, FridgeItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generic LocalStorage Helper
const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const set = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Simulated Async DB for future Supabase migration
export const db = {
    ingredients: {
        getAll: async (): Promise<Ingredient[]> => get<Ingredient>('ingredients'),
        add: async (item: Omit<Ingredient, 'id'>) => {
            const items = get<Ingredient>('ingredients');
            const newItem = { ...item, id: uuidv4() };
            set('ingredients', [...items, newItem]);
            return newItem;
        },
        update: async (item: Ingredient) => {
            const items = get<Ingredient>('ingredients');
            const newItems = items.map((i) => (i.id === item.id ? item : i));
            set('ingredients', newItems);
            return item;
        },
        delete: async (id: string) => {
            const items = get<Ingredient>('ingredients');
            set('ingredients', items.filter((i) => i.id !== id));
        },
    },
    recipes: {
        getAll: async (): Promise<Recipe[]> => get<Recipe>('recipes'),
        getById: async (id: string): Promise<Recipe | undefined> => {
            const items = get<Recipe>('recipes');
            return items.find(i => i.id === id);
        },
        add: async (item: Omit<Recipe, 'id' | 'createdAt'>) => {
            const items = get<Recipe>('recipes');
            const newItem: Recipe = { ...item, id: uuidv4(), createdAt: Date.now() };
            set('recipes', [...items, newItem]);
            return newItem;
        },
        update: async (item: Recipe) => {
            const items = get<Recipe>('recipes');
            const newItems = items.map((i) => (i.id === item.id ? item : i));
            set('recipes', newItems);
            return item;
        },
        toggleFavorite: async (id: string) => {
            const items = get<Recipe>('recipes');
            const item = items.find(i => i.id === id);
            if (item) {
                item.favorite = !item.favorite;
                set('recipes', items);
                return item;
            }
        },
        delete: async (id: string) => {
            const items = get<Recipe>('recipes');
            set('recipes', items.filter((i) => i.id !== id));
        },
    },
    mealPlans: {
        getAll: async (): Promise<MealPlan[]> => get<MealPlan>('mealPlans'),
        add: async (item: Omit<MealPlan, 'id'>) => {
            const items = get<MealPlan>('mealPlans');
            const newItem = { ...item, id: uuidv4() };
            set('mealPlans', [...items, newItem]);
            return newItem;
        },
        delete: async (id: string) => {
            const items = get<MealPlan>('mealPlans');
            set('mealPlans', items.filter((i) => i.id !== id));
        }
    },
    fridge: {
        getAll: async (): Promise<FridgeItem[]> => get<FridgeItem>('fridge'),
        add: async (item: Omit<FridgeItem, 'id'>) => {
            const items = get<FridgeItem>('fridge');
            const newItem = { ...item, id: uuidv4() };
            set('fridge', [...items, newItem]);
            return newItem;
        },
        delete: async (id: string) => {
            const items = get<FridgeItem>('fridge');
            set('fridge', items.filter((i) => i.id !== id));
        }
    }
};
