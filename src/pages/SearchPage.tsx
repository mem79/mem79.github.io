import React, { useState, useEffect } from 'react';
import { Input } from '../components/common/Input';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/common/Card';
import { Link } from 'react-router-dom';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Mic, MicOff, Clock, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

const difficultyColor: Record<string, string> = {
    '簡単': 'text-green-500',
    '普通': 'text-yellow-500',
    '難しい': 'text-red-500',
};

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const { recipes, ingredients } = useStore();
    const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput();

    useEffect(() => {
        if (transcript) {
            setQuery(transcript);
        }
    }, [transcript]);

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())) ||
        r.ingredientIds.some((id: string) => {
            const ing = ingredients.find(i => i.id === id);
            return ing?.name.toLowerCase().includes(query.toLowerCase());
        })
    );

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">レシピ検索</h1>

            <div className="flex gap-2 sticky top-0 z-10 bg-background pb-2">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="料理名・食材・タグで検索..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 pl-9"
                    />
                </div>
                {isSupported && (
                    <Button
                        size="icon"
                        variant={isListening ? 'destructive' : 'secondary'}
                        onClick={isListening ? stopListening : startListening}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </Button>
                )}
            </div>

            {query && (
                <p className="text-sm text-muted-foreground">
                    「{query}」の検索結果：{filteredRecipes.length}件
                </p>
            )}

            {filteredRecipes.length === 0 && query && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>レシピが見つかりませんでした</p>
                    <p className="text-xs mt-1">別のキーワードをお試しください</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {filteredRecipes.map(recipe => (
                    <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                        <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                            <div className="aspect-square relative">
                                <img
                                    src={recipe.thumbnailUrl || recipe.imageUrl}
                                    alt={recipe.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover rounded-t-lg"
                                />
                                {recipe.favorite && (
                                    <span className="absolute top-2 right-2 text-red-500 drop-shadow">❤️</span>
                                )}
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock size={10} />{recipe.time}分</span>
                                    <span className={difficultyColor[recipe.difficulty] || ''}>{recipe.difficulty}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {recipe.tags.map((tag: string) => (
                                        <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
