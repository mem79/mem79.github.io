import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, Calendar, ChefHat, Refrigerator, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';

export const AppShell: React.FC = () => {

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header - Desktop mostly, or Mobile top bar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <a className="mr-6 flex items-center space-x-2" href="/">
                            <ChefHat size={20} className="text-primary" />
                            <span className="hidden font-bold sm:inline-block">うまペディア</span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Search will go here later */}
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container py-6 pb-20 md:pb-6 overflow-y-auto">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur z-50 h-16 flex items-center justify-around px-2 pb-safe">
                <NavLink to="/" className={({ isActive }) => cn("flex flex-col items-center justify-center p-2 text-xs gap-1", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                    <Home size={24} />
                    <span>ホーム</span>
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => cn("flex flex-col items-center justify-center p-2 text-xs gap-1", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                    <Search size={24} />
                    <span>検索</span>
                </NavLink>
                <NavLink to="/recipes/new" className={() => cn("flex flex-col items-center justify-center -mt-6")}>
                    <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                        <ChefHat size={28} />
                    </div>
                </NavLink>
                <NavLink to="/fridge" className={({ isActive }) => cn("flex flex-col items-center justify-center p-2 text-xs gap-1", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                    <Refrigerator size={24} />
                    <span>冷蔵庫</span>
                </NavLink>
                <NavLink to="/plan" className={({ isActive }) => cn("flex flex-col items-center justify-center p-2 text-xs gap-1", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                    <Calendar size={24} />
                    <span>献立</span>
                </NavLink>
            </nav>
        </div>
    );
};

const ThemeToggle = () => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    React.useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
    );
};
