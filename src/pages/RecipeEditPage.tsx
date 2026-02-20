import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { generateThumbnail } from '../lib/image';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { X, Upload, Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

const RecipeEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { addRecipe, ingredients } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [time, setTime] = useState('30');
    const [difficulty, setDifficulty] = useState<'簡単' | '普通' | '難しい'>('簡単');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; qty: string }[]>([]);
    const [ingSearch, setIngSearch] = useState('');
    const [tags, setTags] = useState('');

    // Voice transcript -> body
    React.useEffect(() => {
        if (transcript) setDesc(prev => prev ? prev + '\n' + transcript : transcript);
    }, [transcript]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddIngredient = (ingId: string) => {
        if (selectedIngredients.find(i => i.id === ingId)) return;
        setSelectedIngredients([...selectedIngredients, { id: ingId, qty: '' }]);
        setIngSearch('');
    };

    const handleRemoveIngredient = (ingId: string) => {
        setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingId));
    };

    const handleQtyChange = (ingId: string, qty: string) => {
        setSelectedIngredients(selectedIngredients.map(i => i.id === ingId ? { ...i, qty } : i));
    };

    const handleSubmit = async () => {
        if (!title || !desc) {
            alert('料理名と作り方は必須です');
            return;
        }

        const quantities = selectedIngredients.reduce((acc: Record<string, string>, curr) => {
            acc[curr.id] = curr.qty;
            return acc;
        }, {});

        let thumbnailUrl: string | undefined;
        if (imagePreview) {
            try {
                thumbnailUrl = await generateThumbnail(imagePreview);
            } catch (e) {
                console.error('サムネイル生成失敗', e);
            }
        }

        await addRecipe({
            title,
            body: desc,
            time: parseInt(time),
            difficulty,
            ingredientIds: selectedIngredients.map((i) => i.id),
            quantities,
            imageUrl: imagePreview || undefined,
            thumbnailUrl,
            favorite: false,
            tags: tags.split(/[,、]/).map(t => t.trim()).filter(Boolean),
        });
        navigate('/');
    };

    const filteredIngredients = ingredients.filter(
        i =>
            i.name.toLowerCase().includes(ingSearch.toLowerCase()) &&
            !selectedIngredients.find(s => s.id === i.id)
    );

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold">レシピ登録</h1>

            <div className="space-y-4">
                {/* Image Upload */}
                <div
                    className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="プレビュー" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Upload className="mx-auto mb-2" />
                            <span className="text-sm">写真をアップロード</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">料理名 *</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：親子丼" />
                </div>

                {/* Time & Difficulty */}
                <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium">調理時間（分）</label>
                        <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-medium">難易度</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as '簡単' | '普通' | '難しい')}
                        >
                            <option value="簡単">簡単</option>
                            <option value="普通">普通</option>
                            <option value="難しい">難しい</option>
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">タグ（カンマ区切り）</label>
                    <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="例：和食、時短、夕食" />
                </div>

                {/* Ingredients */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">使用食材</label>
                    <div className="relative">
                        <Input
                            placeholder="食材を検索して追加..."
                            value={ingSearch}
                            onChange={(e) => setIngSearch(e.target.value)}
                        />
                        {ingSearch && filteredIngredients.length > 0 && (
                            <Card className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto">
                                <CardContent className="p-2">
                                    {filteredIngredients.map(ing => (
                                        <div
                                            key={ing.id}
                                            className="p-2 hover:bg-muted cursor-pointer rounded flex justify-between"
                                            onClick={() => handleAddIngredient(ing.id)}
                                        >
                                            <span>{ing.name}</span>
                                            <span className="text-xs text-muted-foreground">{ing.category}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="space-y-2 mt-2">
                        {selectedIngredients.map(item => {
                            const ingName = ingredients.find(i => i.id === item.id)?.name;
                            return (
                                <div key={item.id} className="flex gap-2 items-center">
                                    <span className="flex-1 text-sm">{ingName}</span>
                                    <Input
                                        className="w-28 h-8"
                                        placeholder="分量（例：2本）"
                                        value={item.qty}
                                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                    />
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleRemoveIngredient(item.id)}>
                                        <X size={16} />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Body / Instructions */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">作り方 *</label>
                        {isSupported && (
                            <Button
                                size="sm"
                                variant={isListening ? 'destructive' : 'outline'}
                                onClick={isListening ? stopListening : startListening}
                                className="h-7 text-xs"
                            >
                                {isListening ? <><MicOff size={12} className="mr-1" />停止</> : <><Mic size={12} className="mr-1" />音声入力</>}
                            </Button>
                        )}
                    </div>
                    <textarea
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="1. ○○を切る&#10;2. ○○を炒める&#10;..."
                    />
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit}>
                    レシピを保存する
                </Button>
            </div>
        </div>
    );
};

export default RecipeEditPage;
