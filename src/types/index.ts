export interface Ingredient {
    id: string;
    name: string;
    category: string;
    memo?: string;
}

export interface Recipe {
    id: string;
    title: string;
    ingredientIds: string[];
    quantities: Record<string, string>; // ingredientId -> quantity text
    body: string;
    imageUrl?: string;
    thumbnailUrl?: string; // 300x300
    time: number; // minutes
    difficulty: '簡単' | '普通' | '難しい';
    favorite: boolean;
    tags: string[];
    createdAt: number;
}

export interface MealPlan {
    id: string;
    date: string; // ISO Date YYYY-MM-DD
    recipeId?: string;       // optional: linked recipe
    customTitle?: string;    // free-text entry (no recipe registered)
    period: '朝食' | '昼食' | '夕食';
}

export interface FridgeItem {
    id: string;
    ingredientId: string;
    quantity: string;
    expireDate: string;
}

export type Category = '野菜' | '肉類' | '魚介類' | '調味料' | '乳製品' | 'その他';

export const CATEGORIES: Category[] = ['野菜', '肉類', '魚介類', '調味料', '乳製品', 'その他'];
