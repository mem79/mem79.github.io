import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { MealPlan } from '../types';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { Sparkles, CalendarDays, X, ChefHat, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../components/common/Input';

const DAYS_JP = ['月', '火', '水', '木', '金', '土', '日'];
const PERIODS: MealPlan['period'][] = ['朝食', '昼食', '夕食'];

type AddModalState = {
    date: string;
    period: MealPlan['period'];
} | null;

const MealPlanPage: React.FC = () => {
    const { recipes, fridge, ingredients, mealPlans, addMealPlan, removeMealPlan, initialize } = useStore();
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [suggesting, setSuggesting] = useState(false);
    const [addModal, setAddModal] = useState<AddModalState>(null);

    // Modal inner state
    const [tab, setTab] = useState<'recipe' | 'custom'>('recipe');
    const [recipeSearch, setRecipeSearch] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    useEffect(() => {
        initialize();
    }, [initialize]);

    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + 1 + i); // Start Monday
        return d;
    });

    const toDateStr = (d: Date) => d.toISOString().split('T')[0];

    const getMealsForSlot = (date: string, period: MealPlan['period']) =>
        mealPlans.filter(m => m.date === date && m.period === period);

    const handleOpenModal = (date: string, period: MealPlan['period']) => {
        setTab('recipe');
        setRecipeSearch('');
        setCustomTitle('');
        setAddModal({ date, period });
    };

    const handleAddRecipe = async (recipeId: string) => {
        if (!addModal) return;
        await addMealPlan({ date: addModal.date, period: addModal.period, recipeId });
        setAddModal(null);
    };

    const handleAddCustom = async () => {
        if (!addModal || !customTitle.trim()) return;
        await addMealPlan({ date: addModal.date, period: addModal.period, customTitle: customTitle.trim() });
        setAddModal(null);
        setCustomTitle('');
    };

    const handleAISuggest = async () => {
        setSuggesting(true);
        setSuggestion(null);
        await new Promise(r => setTimeout(r, 1200));

        const fridgeIngIds = fridge.map(f => f.ingredientId);
        const matches = recipes.filter(r => r.ingredientIds.some(id => fridgeIngIds.includes(id)));

        if (matches.length > 0) {
            const pick = matches[Math.floor(Math.random() * matches.length)];
            const matchedIngs = pick.ingredientIds
                .filter(id => fridgeIngIds.includes(id))
                .map(id => ingredients.find(i => i.id === id)?.name)
                .filter(Boolean).join('、');
            setSuggestion(`「${pick.title}」はいかがですか？冷蔵庫の「${matchedIngs}」が活用できます！`);
        } else if (recipes.length > 0) {
            const pick = recipes[Math.floor(Math.random() * recipes.length)];
            setSuggestion(`「${pick.title}」はいかがですか？`);
        } else {
            setSuggestion('レシピを登録するとAIシェフが提案できます 🍳');
        }
        setSuggesting(false);
    };

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(recipeSearch.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays size={24} /> 献立計画
            </h1>

            {/* AI Suggestion */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" />
                        <h2 className="font-semibold">AIシェフに相談する</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">冷蔵庫の食材を元に今日の献立を提案します</p>
                    <Button variant="default" className="w-full" onClick={handleAISuggest} disabled={suggesting}>
                        {suggesting ? '考え中...' : '献立を提案してもらう'}
                    </Button>
                    {suggestion && (
                        <div className="mt-2 p-3 bg-background rounded-lg border text-sm">
                            <p className="font-medium text-primary mb-1">🍽 AIシェフのおすすめ</p>
                            <p>{suggestion}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Weekly Calendar */}
            <div>
                <h2 className="font-semibold mb-3">今週の献立</h2>
                <div className="space-y-2">
                    {weekDates.map((date, i) => {
                        const dateStr = toDateStr(date);
                        const isToday = dateStr === toDateStr(today);
                        return (
                            <div key={i} className={`rounded-lg border p-3 ${isToday ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-bold text-sm w-6 ${isToday ? 'text-primary' : ''}`}>{DAYS_JP[i]}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {date.getMonth() + 1}/{date.getDate()}
                                        {isToday && <span className="ml-1 text-primary font-semibold">（今日）</span>}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {PERIODS.map(period => {
                                        const meals = getMealsForSlot(dateStr, period);
                                        return (
                                            <div key={period}>
                                                <span className="text-[10px] text-muted-foreground block mb-1">{period}</span>
                                                <div className="space-y-1">
                                                    {meals.map(meal => {
                                                        const recipe = meal.recipeId ? recipes.find(r => r.id === meal.recipeId) : null;
                                                        const title = recipe ? recipe.title : meal.customTitle ?? '';
                                                        return (
                                                            <div key={meal.id} className="group relative">
                                                                {recipe ? (
                                                                    <Link to={`/recipes/${recipe.id}`}>
                                                                        <div className="rounded border border-primary/40 bg-primary/10 p-1 text-[11px] font-medium text-primary leading-tight line-clamp-2 hover:bg-primary/20 transition-colors">
                                                                            {title}
                                                                        </div>
                                                                    </Link>
                                                                ) : (
                                                                    <div className="rounded border border-muted bg-muted/50 p-1 text-[11px] leading-tight line-clamp-2">
                                                                        {title}
                                                                    </div>
                                                                )}
                                                                <button
                                                                    onClick={() => removeMealPlan(meal.id)}
                                                                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex w-4 h-4 bg-destructive text-white rounded-full items-center justify-center z-10"
                                                                >
                                                                    <X size={10} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                    {/* Add slot */}
                                                    <button
                                                        onClick={() => handleOpenModal(dateStr, period)}
                                                        className="w-full h-7 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                                    >
                                                        + 追加
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Meal Modal */}
            {addModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && setAddModal(null)}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAddModal(null)} />

                    <div className="relative w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl shadow-xl z-10 max-h-[80vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <div>
                                <h2 className="font-bold">献立を追加</h2>
                                <p className="text-xs text-muted-foreground">{addModal.date} ・ {addModal.period}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setAddModal(null)}>
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'recipe' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTab('recipe')}
                            >
                                <ChefHat size={14} className="inline mr-1" />
                                レシピから選ぶ
                            </button>
                            <button
                                className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'custom' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setTab('custom')}
                            >
                                ✏️ 自由入力
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-4">
                            {tab === 'recipe' ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="レシピ名で検索..."
                                            value={recipeSearch}
                                            onChange={(e) => setRecipeSearch(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                    {filteredRecipes.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            <p>レシピが見つかりません</p>
                                            <Link to="/recipes/new" onClick={() => setAddModal(null)}>
                                                <Button size="sm" variant="outline" className="mt-3">レシピを登録する</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        filteredRecipes.map(recipe => (
                                            <button
                                                key={recipe.id}
                                                onClick={() => handleAddRecipe(recipe.id)}
                                                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <img
                                                    src={recipe.thumbnailUrl || recipe.imageUrl || 'https://placehold.co/56x56'}
                                                    alt={recipe.title}
                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                />
                                                <div>
                                                    <p className="font-semibold text-sm">{recipe.title}</p>
                                                    <p className="text-xs text-muted-foreground">{recipe.time}分 ・ {recipe.difficulty}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">レシピに登録されていない料理や食べ物も入力できます</p>
                                    <Input
                                        placeholder="例：コンビニのお弁当、外食（ラーメン）..."
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                                        autoFocus
                                    />
                                    <Button
                                        className="w-full"
                                        onClick={handleAddCustom}
                                        disabled={!customTitle.trim()}
                                    >
                                        追加する
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanPage;
