import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardContent } from '../components/common/Card';
import { Trash2, AlertTriangle, PackageOpen } from 'lucide-react';
import { Tag } from '../components/common/Tag';

const FridgePage: React.FC = () => {
    const { fridge, ingredients, addToFridge, removeFromFridge, initialize } = useStore();
    const [selectedIngId, setSelectedIngId] = useState('');
    const [qty, setQty] = useState('');
    const [expireDate, setExpireDate] = useState('');

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleAdd = async () => {
        if (!selectedIngId || !qty || !expireDate) {
            alert('食材・分量・消費期限をすべて入力してください');
            return;
        }
        await addToFridge({
            ingredientId: selectedIngId,
            quantity: qty,
            expireDate,
        });
        setSelectedIngId('');
        setQty('');
        setExpireDate('');
    };

    const isExpiringSoon = (dateStr: string) => {
        const diffMs = new Date(dateStr).getTime() - Date.now();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= 3 && diffDays >= 0;
    };

    const isExpired = (dateStr: string) => {
        return new Date(dateStr).getTime() < Date.now();
    };

    const filteredFridge = fridge;

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold">🧊 冷蔵庫</h1>

            {/* Add form */}
            <Card>
                <CardContent className="pt-6 space-y-3">
                    <h2 className="font-semibold text-sm">食材を追加</h2>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedIngId}
                        onChange={(e) => setSelectedIngId(e.target.value)}
                    >
                        <option value="">食材を選んでください</option>
                        {ingredients.map(ing => (
                            <option key={ing.id} value={ing.id}>{ing.name} ({ing.category})</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <Input
                            placeholder="分量（例：2本）"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            type="date"
                            value={expireDate}
                            onChange={(e) => setExpireDate(e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    <Button className="w-full" onClick={handleAdd}>追加する</Button>
                </CardContent>
            </Card>

            {/* Fridge items */}
            <div className="space-y-3">
                <h2 className="font-semibold">冷蔵庫の中身 <span className="text-muted-foreground text-sm font-normal">({filteredFridge.length}品)</span></h2>

                {filteredFridge.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <PackageOpen size={48} className="mx-auto mb-3 opacity-30" />
                        <p>食材がありません</p>
                    </div>
                ) : (
                    filteredFridge.map(item => {
                        const ing = ingredients.find(i => i.id === item.ingredientId);
                        const expired = isExpired(item.expireDate);
                        const soonExpiring = isExpiringSoon(item.expireDate);
                        return (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${expired ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                                    soonExpiring ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' :
                                        'border-border'
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{ing?.name}</span>
                                        {expired && <Tag variant="destructive" className="text-[10px]">期限切れ</Tag>}
                                        {soonExpiring && !expired && (
                                            <span className="flex items-center gap-1 text-yellow-600 text-xs">
                                                <AlertTriangle size={12} />もうすぐ期限
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-0.5">
                                        {item.quantity} ・ 消費期限: {item.expireDate}
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive h-8 w-8 ml-2"
                                    onClick={() => removeFromFridge(item.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default FridgePage;
