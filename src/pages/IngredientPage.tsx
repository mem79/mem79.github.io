import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES, Category, Recipe } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Tag } from '../components/common/Tag';
import { Plus, X, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Link } from 'react-router-dom';

const categoryEmoji: Record<string, string> = {
    '野菜': '🥦',
    '肉類': '🥩',
    '魚介類': '🐟',
    '調味料': '🧂',
    '乳製品': '🥚',
    'その他': '🍱',
};

const difficultyColor: Record<string, string> = {
    '簡単': 'text-green-500',
    '普通': 'text-yellow-500',
    '難しい': 'text-red-500',
};

const IngredientPage: React.FC = () => {
    const { ingredients, recipes, addIngredient, initialize } = useStore();
    const [newIngName, setNewIngName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('野菜');

    // Modal state
    const [modalIngId, setModalIngId] = useState<string | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleAdd = async () => {
        if (!newIngName.trim()) return;
        await addIngredient({ name: newIngName.trim(), category: selectedCategory });
        setNewIngName('');
    };

    const groupedIngredients = ingredients.reduce((acc, ing) => {
        if (!acc[ing.category]) acc[ing.category] = [];
        acc[ing.category].push(ing);
        return acc;
    }, {} as Record<string, typeof ingredients>);

    const linkedRecipes = (ingId: string): Recipe[] =>
        recipes.filter(r => r.ingredientIds.includes(ingId));

    const modalIng = ingredients.find(i => i.id === modalIngId);
    const modalRecipes = modalIngId ? linkedRecipes(modalIngId) : [];

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold">食材管理</h1>

            {/* Add Form */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="食材名を入力..."
                            value={newIngName}
                            onChange={(e) => setNewIngName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button onClick={handleAdd} disabled={!newIngName.trim()}>
                            <Plus size={18} />
                        </Button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {CATEGORIES.map(cat => (
                            <Tag
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                className="cursor-pointer whitespace-nowrap select-none"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {categoryEmoji[cat]} {cat}
                            </Tag>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Ingredient list */}
            {ingredients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>食材がまだありません。上のフォームから追加してください。</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {CATEGORIES.map(category => {
                        const items = groupedIngredients[category] || [];
                        if (items.length === 0) return null;
                        return (
                            <div key={category}>
                                <h3 className="font-semibold text-base mb-2 flex items-center gap-1">
                                    {categoryEmoji[category]} {category}
                                    <span className="text-xs text-muted-foreground ml-1">({items.length}種)</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {items.map(ing => {
                                        const count = linkedRecipes(ing.id).length;
                                        return (
                                            <button
                                                key={ing.id}
                                                onClick={() => setModalIngId(ing.id)}
                                                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium cursor-pointer border border-transparent hover:border-primary"
                                            >
                                                {ing.name}
                                                {count > 0 && (
                                                    <span className="text-[11px] bg-primary/20 group-hover:bg-white/20 text-primary group-hover:text-white rounded-full px-1.5 py-0.5 font-semibold">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recipe List Modal */}
            {modalIngId && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={(e) => e.target === e.currentTarget && setModalIngId(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalIngId(null)} />

                    {/* Sheet / Card */}
                    <div className="relative w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl shadow-xl z-10 max-h-[85vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <div>
                                <h2 className="font-bold text-lg">{modalIng?.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {modalRecipes.length > 0
                                        ? `${modalRecipes.length}件のレシピで使用中`
                                        : 'このレシピで使われていません'}
                                </p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setModalIngId(null)}>
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Recipe list */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-3">
                            {modalRecipes.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>このレシピで使われていません</p>
                                    <Link to="/recipes/new" onClick={() => setModalIngId(null)}>
                                        <Button variant="outline" className="mt-4" size="sm">レシピを登録する</Button>
                                    </Link>
                                </div>
                            ) : (
                                modalRecipes.map(recipe => (
                                    <Link
                                        key={recipe.id}
                                        to={`/recipes/${recipe.id}`}
                                        onClick={() => setModalIngId(null)}
                                    >
                                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                                            <img
                                                src={recipe.thumbnailUrl || recipe.imageUrl || 'https://placehold.co/80x80'}
                                                alt={recipe.title}
                                                className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm line-clamp-2">{recipe.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Clock size={10} />{recipe.time}分</span>
                                                    <span className={difficultyColor[recipe.difficulty] || ''}>{recipe.difficulty}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    分量: {recipe.quantities[modalIngId] || '適量'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientPage;
