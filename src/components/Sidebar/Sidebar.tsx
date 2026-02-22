import { useTranslation } from 'react-i18next';
import type { Category, Place } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/icons';
import { useTheme } from '../../context/ThemeContext';
import ImageGallery from '../ImageGallery/ImageGallery';
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

  const isFiltered = searchQuery !== '' || activeCategories.size > 0 || showFavoritesOnly;

  const mapsUrl = selectedPlace
    ? `https://www.google.com/maps/search/?api=1&query=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`
    : '';

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

            <a
              className="directions-btn"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ {t('detail.getDirections')}
            </a>
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

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <span>{t('sidebar.footer')}</span>
      </div>
    </aside>
  );
}
