import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/common/Button';
import { Tag } from '../components/common/Tag';
import { Heart, Clock, ChefHat, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';

const difficultyColor: Record<string, string> = {
    '簡単': 'text-green-500',
    '普通': 'text-yellow-500',
    '難しい': 'text-red-500',
};

const RecipeDetailPage: React.FC = () => {
    const { id } = useParams();
    const { recipes, ingredients, toggleFavorite } = useStore();
    const [servings, setServings] = useState(2); // default 2 persons

    const recipe = recipes.find(r => r.id === id);

    if (!recipe) return (
        <div className="text-center py-20 text-muted-foreground">
            <ChefHat size={48} className="mx-auto mb-3 opacity-30" />
            <p>レシピが見つかりません</p>
            <Link to="/"><Button className="mt-4" variant="outline">ホームへ戻る</Button></Link>
        </div>
    );

    const baseServings = 2;
    const scale = servings / baseServings;

    const scaleQty = (qty: string) => {
        const num = parseFloat(qty);
        if (isNaN(num)) return qty; // text like "少々" — keep as is
        const scaled = num * scale;
        return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Hero Image */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
                <img
                    src={recipe.imageUrl || 'https://placehold.co/800x450'}
                    alt={recipe.title}
                    className="w-full aspect-video object-cover"
                />
                <button
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-2 shadow"
                    onClick={() => toggleFavorite(recipe.id)}
                >
                    <Heart
                        size={22}
                        className={recipe.favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                </button>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">{recipe.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14} />{recipe.time}分</span>
                    <span className={`font-medium ${difficultyColor[recipe.difficulty] || ''}`}>{recipe.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.tags.map((tag: string) => (
                        <Tag key={tag} variant="secondary" className="text-xs">{tag}</Tag>
                    ))}
                </div>
            </div>

            {/* Servings Scaler */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">人数調整</span>
                        <div className="flex items-center gap-3">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setServings(s => Math.max(1, s - 1))}>
                                <Minus size={16} />
                            </Button>
                            <span className="font-bold text-lg w-8 text-center">{servings}</span>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setServings(s => s + 1)}>
                                <Plus size={16} />
                            </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">{servings}人前</span>
                    </div>
                </CardContent>
            </Card>

            {/* Ingredients */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold">材料</h2>
                <div className="space-y-2">
                    {recipe.ingredientIds.map((ingId: string) => {
                        const ing = ingredients.find(i => i.id === ingId);
                        const qty = recipe.quantities[ingId];
                        if (!ing) return null;
                        return (
                            <div key={ingId} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <span>{ing.name}</span>
                                <span className="text-muted-foreground font-medium">
                                    {qty ? scaleQty(qty) : '適量'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold">作り方</h2>
                <div className="space-y-3">
                    {recipe.body.split('\n').filter(Boolean).map((step: string, i: number) => (
                        <div key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                {i + 1}
                            </span>
                            <p className="text-sm leading-relaxed flex-1 pt-0.5">{step.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
