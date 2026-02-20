import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import IngredientPage from './pages/IngredientPage';
import RecipeEditPage from './pages/RecipeEditPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FridgePage from './pages/FridgePage';
import MealPlanPage from './pages/MealPlanPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/ingredients" element={<IngredientPage />} />
                    <Route path="/recipes/new" element={<RecipeEditPage />} />
                    <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                    <Route path="/fridge" element={<FridgePage />} />
                    <Route path="/plan" element={<MealPlanPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
