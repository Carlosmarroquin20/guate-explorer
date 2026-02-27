import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category, Place } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/icons';
import { useTheme } from '../../context/ThemeContext';
import ImageGallery from '../ImageGallery/ImageGallery';
import PlaceChat from '../PlaceChat/PlaceChat';
import i18n from '../../i18n';
import './Sidebar.css';

const ALL_CATEGORIES: Category[] = [
  'archaeological', 'volcano', 'lake', 'nature', 'colonial', 'beach', 'cave',
];

interface SidebarProps {
  places: Place[];
  filteredPlaces: Place[];
  selectedPlace: Place | null;
  searchQuery: string;
  activeCategories: Set<Category>;
  showFavoritesOnly: boolean;
  favorites: string[];
  onPlaceSelect: (place: Place) => void;
  onPlaceDeselect: () => void;
  onSearchChange: (q: string) => void;
  onCategoryToggle: (cat: Category) => void;
  onFavoritesToggle: () => void;
  onResetFilters: () => void;
  onFavoriteToggle: (id: string) => void;
}

function toggleLanguage() {
  const next = i18n.language === 'es' ? 'en' : 'es';
  i18n.changeLanguage(next);
  localStorage.setItem('lang', next);
}

export default function Sidebar({
  places,
  filteredPlaces,
  selectedPlace,
  searchQuery,
  activeCategories,
  showFavoritesOnly,
  favorites,
  onPlaceSelect,
  onPlaceDeselect,
  onSearchChange,
  onCategoryToggle,
  onFavoritesToggle,
  onResetFilters,
  onFavoriteToggle,
}: SidebarProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  // ── Directional slide transitions ────────────────────────────────────────
  // navKey forces React to remount the view container, retriggering the CSS
  // animation on every navigation regardless of direction.
  const [navKey, setNavKey] = useState(0);
  const [slideDir, setSlideDir] = useState<'right' | 'left' | null>(null);

  // Track the previous selectedPlace to know which direction to animate.
  // Initialize with the current value so the first render has no animation.
  const prevSelectedRef = useRef<Place | null>(selectedPlace);

  useEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selectedPlace;

    // Skip animation on the very first render (prev === selectedPlace at init)
    if (prev === selectedPlace) return;

    // null → Place: open detail (slide from right)
    // Place → null: go back to list (slide from left)
    setSlideDir(selectedPlace !== null ? 'right' : 'left');
    setNavKey((k) => k + 1);
  }, [selectedPlace]);
  // ─────────────────────────────────────────────────────────────────────────

  const isFiltered = searchQuery !== '' || activeCategories.size > 0 || showFavoritesOnly;

  const mapsUrl = selectedPlace
    ? `https://www.google.com/maps/search/?api=1&query=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`
    : '';

  // Copy the current app URL (includes ?place=id deep link) to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <aside className="sidebar">
      {/* ── Header ── */}
      <div className="sidebar-header">
        <div className="sidebar-header-text">
          <h1 className="sidebar-title">
            <span className="sidebar-logo">🇬🇹</span>
            Guate Explorer
          </h1>
          <p className="sidebar-subtitle">{t('sidebar.subtitle')}</p>
        </div>
        <div className="sidebar-controls">
          <button
            className="control-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="control-btn lang-btn" onClick={toggleLanguage} title="Change language">
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="sidebar-content">
        {/* key forces remount on each navigation, retriggering the CSS animation */}
        <div
          key={navKey}
          className={`view-container${slideDir ? ` slide-${slideDir}` : ''}`}
        >
          {selectedPlace ? (
            /* ── Detail view ── */
            <div className="place-detail">
              <button className="back-button" onClick={onPlaceDeselect}>
                {t('sidebar.backToList')}
              </button>

              <div className="detail-header">
                <span
                  className="detail-icon"
                  style={{ backgroundColor: getCategoryColor(selectedPlace.category) }}
                >
                  {getCategoryIcon(selectedPlace.category)}
                </span>
                <div>
                  <h2 className="detail-title">{selectedPlace.name}</h2>
                  <p className="detail-location">{selectedPlace.department}</p>
                </div>
              </div>

              <ImageGallery query={selectedPlace.wikimediaQuery} />

              <div className="detail-info">
                <span
                  className="detail-category"
                  style={{ backgroundColor: getCategoryColor(selectedPlace.category) }}
                >
                  {selectedPlace.category}
                </span>
                <p className="detail-description">{selectedPlace.description}</p>
              </div>

              <div className="detail-actions">
                <a
                  className="directions-btn"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🗺️ {t('detail.getDirections')}
                </a>
                <button
                  className={`copy-link-btn ${copied ? 'copy-link-btn--copied' : ''}`}
                  onClick={handleCopyLink}
                  disabled={copied}
                >
                  {copied ? `✓ ${t('detail.linkCopied')}` : `🔗 ${t('detail.copyLink')}`}
                </button>
              </div>

              <PlaceChat place={selectedPlace} />
            </div>
          ) : (
            /* ── List view ── */
            <>
              {/* Search */}
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder={t('sidebar.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => onSearchChange('')}>
                    ✕
                  </button>
                )}
              </div>

              {/* Category chips */}
              <div className="chips">
                <button
                  className={`chip ${!isFiltered ? 'chip-active' : ''}`}
                  onClick={onResetFilters}
                >
                  {t('sidebar.all')}
                </button>

                <button
                  className={`chip chip-fav ${showFavoritesOnly ? 'chip-active' : ''}`}
                  onClick={onFavoritesToggle}
                >
                  ❤️
                  {favorites.length > 0 && (
                    <span className="chip-badge">{favorites.length}</span>
                  )}
                </button>

                {ALL_CATEGORIES.filter((cat) => places.some((p) => p.category === cat)).map((cat) => (
                  <button
                    key={cat}
                    className={`chip ${activeCategories.has(cat) ? 'chip-active' : ''}`}
                    onClick={() => onCategoryToggle(cat)}
                    title={cat}
                    style={
                      activeCategories.has(cat)
                        ? { backgroundColor: getCategoryColor(cat), borderColor: getCategoryColor(cat), color: '#fff' }
                        : {}
                    }
                  >
                    {getCategoryIcon(cat)}
                  </button>
                ))}
              </div>

              {/* Count */}
              <div className="places-count">
                {t('sidebar.placesCount', { count: filteredPlaces.length })}
              </div>

              {/* Empty state */}
              {filteredPlaces.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <p>{t('sidebar.noResults')}</p>
                </div>
              ) : (
                <ul className="places-list">
                  {filteredPlaces.map((place) => (
                    <li key={place.id}>
                      <button className="place-card" onClick={() => onPlaceSelect(place)}>
                        <span
                          className="place-icon"
                          style={{ backgroundColor: getCategoryColor(place.category) }}
                        >
                          {getCategoryIcon(place.category)}
                        </span>
                        <div className="place-info">
                          <h3 className="place-name">{place.name}</h3>
                          <p className="place-meta">{place.department}</p>
                          <p className="place-description">{place.description}</p>
                        </div>
                        <button
                          className={`fav-btn ${favorites.includes(place.id) ? 'fav-btn-active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteToggle(place.id);
                          }}
                          title={
                            favorites.includes(place.id)
                              ? t('sidebar.removeFavorite')
                              : t('sidebar.addFavorite')
                          }
                        >
                          {favorites.includes(place.id) ? '❤️' : '🤍'}
                        </button>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <span>{t('sidebar.footer')}</span>
      </div>
    </aside>
  );
}
