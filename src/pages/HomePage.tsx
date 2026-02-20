import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { generateDummyData } from '../lib/seed';
import { Link } from 'react-router-dom';
import { Heart, Clock, ChefHat } from 'lucide-react';

const difficultyColor: Record<string, string> = {
    '簡単': 'text-green-500',
    '普通': 'text-yellow-500',
    '難しい': 'text-red-500',
};

const HomePage: React.FC = () => {
    const { recipes, initialize } = useStore();

    useEffect(() => {
        generateDummyData().then(() => initialize());
    }, [initialize]);

    const favoriteRecipes = recipes.filter(r => r.favorite);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">うまペディア</h1>
                    <p className="text-sm text-muted-foreground">あなたのレシピ管理帳</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    データリセット
                </Button>
            </div>

            {/* Quick Actions */}
            <section className="flex gap-2 overflow-x-auto pb-1">
                <Link to="/recipes/new">
                    <Button variant="default" size="sm" className="whitespace-nowrap">
                        <ChefHat size={14} className="mr-1" /> レシピ登録
                    </Button>
                </Link>
                <Link to="/ingredients">
                    <Button variant="secondary" size="sm" className="whitespace-nowrap">食材登録</Button>
                </Link>
                <Link to="/fridge">
                    <Button variant="secondary" size="sm" className="whitespace-nowrap">冷蔵庫管理</Button>
                </Link>
                <Link to="/plan">
                    <Button variant="secondary" size="sm" className="whitespace-nowrap">献立計画</Button>
                </Link>
            </section>

            {/* Favorites */}
            {favoriteRecipes.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Heart size={18} className="text-red-500" /> お気に入り
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {favoriteRecipes.map(recipe => (
                            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="flex-shrink-0 w-36">
                                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                                    <div className="aspect-square">
                                        <img
                                            src={recipe.thumbnailUrl || recipe.imageUrl || 'https://placehold.co/300x300'}
                                            alt={recipe.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-2">
                                        <p className="text-xs font-semibold line-clamp-2">{recipe.title}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* All Recipes */}
            <section>
                <h2 className="text-lg font-semibold mb-3">全レシピ</h2>
                {recipes.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <ChefHat size={48} className="mx-auto mb-3 opacity-30" />
                        <p>レシピがまだありません</p>
                        <Link to="/recipes/new">
                            <Button className="mt-4">最初のレシピを登録する</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {recipes.map(recipe => (
                            <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video relative">
                                        <img
                                            src={recipe.imageUrl || 'https://placehold.co/600x400'}
                                            alt={recipe.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                        {recipe.favorite && (
                                            <span className="absolute top-2 right-2 text-red-500 drop-shadow">❤️</span>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-sm line-clamp-1">{recipe.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} />{recipe.time}分
                                            </span>
                                            <span className={difficultyColor[recipe.difficulty] || ''}>{recipe.difficulty}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
