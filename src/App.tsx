import { useState, useMemo } from 'react';
import Map from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import places from './data/places.json';
import type { Category, Place } from './types';
import './App.css';

const typedPlaces = places as Place[];

function AppContent() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('favorites') ?? '[]')
  );

  const filteredPlaces = useMemo(() => {
    return typedPlaces.filter((place) => {
      if (showFavoritesOnly && !favorites.includes(place.id)) return false;
      if (activeCategories.size > 0 && !activeCategories.has(place.category)) return false;
      const q = searchQuery.toLowerCase();
      if (q && !place.name.toLowerCase().includes(q) && !place.department.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [searchQuery, activeCategories, showFavoritesOnly, favorites]);

  const toggleCategory = (cat: Category) => {
    setShowFavoritesOnly(false);
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategories(new Set());
    setShowFavoritesOnly(false);
  };

  return (
    <div className="app">
      <Sidebar
        places={typedPlaces}
        filteredPlaces={filteredPlaces}
        selectedPlace={selectedPlace}
        searchQuery={searchQuery}
        activeCategories={activeCategories}
        showFavoritesOnly={showFavoritesOnly}
        favorites={favorites}
        onPlaceSelect={(place) => setSelectedPlace(place)}
        onPlaceDeselect={() => setSelectedPlace(null)}
        onSearchChange={setSearchQuery}
        onCategoryToggle={toggleCategory}
        onFavoritesToggle={() => {
          setShowFavoritesOnly((v) => !v);
          setActiveCategories(new Set());
        }}
        onResetFilters={resetFilters}
        onFavoriteToggle={toggleFavorite}
      />
      <main className="map-wrapper">
        <Map
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onPlaceSelect={(place) => setSelectedPlace(place)}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
