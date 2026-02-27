import { useState, useMemo, useEffect, useRef } from 'react';
import Map from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import places from './data/places.json';
import type { Category, Place } from './types';
import './App.css';

const typedPlaces = places as Place[];

function AppContent() {
  // Initialize selectedPlace directly from the URL on first render
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('place');
    return id ? (typedPlaces.find((p) => p.id === id) ?? null) : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('favorites') ?? '[]')
  );

  // ── URL sync ──────────────────────────────────────────────────────────────
  // Prevent pushState when the change originated from popstate
  const isPoppingState = useRef(false);
  // Use replaceState on first sync (page load), pushState on subsequent changes
  const isFirstSync = useRef(true);

  // selectedPlace → URL
  useEffect(() => {
    if (isPoppingState.current) {
      isPoppingState.current = false;
      return;
    }

    const url = new URL(window.location.href);
    if (selectedPlace) {
      url.searchParams.set('place', selectedPlace.id);
    } else {
      url.searchParams.delete('place');
    }

    if (isFirstSync.current) {
      isFirstSync.current = false;
      // Don't create a new history entry on page load
      history.replaceState({ placeId: selectedPlace?.id ?? null }, '', url.toString());
    } else {
      history.pushState({ placeId: selectedPlace?.id ?? null }, '', url.toString());
    }
  }, [selectedPlace]);

  // URL → selectedPlace (browser back / forward)
  useEffect(() => {
    const handlePopState = () => {
      isPoppingState.current = true;
      const params = new URLSearchParams(window.location.search);
      const id = params.get('place');
      setSelectedPlace(id ? (typedPlaces.find((p) => p.id === id) ?? null) : null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

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
        onPlaceSelect={setSelectedPlace}
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
          onPlaceSelect={setSelectedPlace}
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
