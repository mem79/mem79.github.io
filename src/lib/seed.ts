import { db } from './db';
import { Ingredient, Recipe } from '../types';

const INGREDIENTS: Omit<Ingredient, 'id'>[] = [
    { name: 'にんじん', category: '野菜' },
    { name: 'たまねぎ', category: '野菜' },
    { name: 'じゃがいも', category: '野菜' },
    { name: '鶏むね肉', category: '肉類' },
    { name: '豚バラ肉', category: '肉類' },
    { name: 'サーモン', category: '魚介類' },
    { name: '醤油', category: '調味料' },
    { name: '卵', category: '乳製品' },
    { name: 'ご飯', category: 'その他' },
];

const RECIPES = (ingredientIds: string[]): Omit<Recipe, 'id' | 'createdAt'>[] => [
    {
        title: 'カレーライス',
        ingredientIds: ingredientIds.slice(0, 5),
        quantities: { [ingredientIds[0]]: '2本', [ingredientIds[1]]: '1個', [ingredientIds[3]]: '300g' },
        body: '1. 野菜と肉を食べやすい大きさに切る。\n2. 肉と野菜を炒める。\n3. 水を加えて煮込む。\n4. カレールーを加えて溶かす。\n5. ご飯と一緒に盛り付けて完成。',
        time: 45,
        difficulty: '簡単',
        favorite: false,
        tags: ['夕食', '子どもに人気'],
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        title: '親子丼',
        ingredientIds: [ingredientIds[3], ingredientIds[1], ingredientIds[7]],
        quantities: { [ingredientIds[3]]: '150g', [ingredientIds[1]]: '1/2個', [ingredientIds[7]]: '2個' },
        body: '1. たまねぎと鶏肉を薄切りにする。\n2. だし・醤油・みりんで煮る。\n3. 溶き卵を回しかけ、半熟になったら火を止める。\n4. ご飯の上に盛り付けて完成。',
        time: 20,
        difficulty: '簡単',
        favorite: true,
        tags: ['和食', '時短'],
        imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=300&h=300&q=80'
    }
];

export const generateDummyData = async () => {
    const existingIngredients = await db.ingredients.getAll();
    if (existingIngredients.length > 0) return;

    console.log('サンプルデータを生成中...');

    const createdIngredients = [];
    for (const ing of INGREDIENTS) {
        const newItem = await db.ingredients.add(ing);
        createdIngredients.push(newItem);
    }

    const ingredientIds = createdIngredients.map(i => i.id);

    for (const recipe of RECIPES(ingredientIds)) {
        await db.recipes.add(recipe);
    }

    console.log('サンプルデータの生成完了！');
};
