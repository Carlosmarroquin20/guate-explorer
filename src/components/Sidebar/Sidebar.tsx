import { useTranslation } from 'react-i18next';
import type { Place } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/icons';
import { useTheme } from '../../context/ThemeContext';
import ImageGallery from '../ImageGallery/ImageGallery';
import i18n from '../../i18n';
import './Sidebar.css';

interface SidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  onPlaceDeselect: () => void;
}

function toggleLanguage() {
  const next = i18n.language === 'es' ? 'en' : 'es';
  i18n.changeLanguage(next);
  localStorage.setItem('lang', next);
}

export default function Sidebar({
  places,
  selectedPlace,
  onPlaceSelect,
  onPlaceDeselect,
}: SidebarProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
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
          <button
            className="control-btn lang-btn"
            onClick={toggleLanguage}
            title="Change language"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        {selectedPlace ? (
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
          </div>
        ) : (
          <>
            <div className="places-count">
              {t('sidebar.placesCount', { count: places.length })}
            </div>

            <ul className="places-list">
              {places.map((place) => (
                <li key={place.id}>
                  <button
                    className="place-card"
                    onClick={() => onPlaceSelect(place)}
                  >
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
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <span>{t('sidebar.footer')}</span>
      </div>
    </aside>
  );
}
