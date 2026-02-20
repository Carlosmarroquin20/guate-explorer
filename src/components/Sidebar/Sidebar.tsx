import type { Place } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/icons';
import './Sidebar.css';

interface SidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
}

export default function Sidebar({ places, selectedPlace, onPlaceSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <span className="sidebar-logo">🇬🇹</span>
          Guate Explorer
        </h1>
        <p className="sidebar-subtitle">Discover Guatemala's wonders</p>
      </div>

      <div className="sidebar-content">
        <div className="places-count">
          {places.length} places to explore
        </div>

        <ul className="places-list">
          {places.map((place) => (
            <li key={place.id}>
              <button
                className={`place-card ${selectedPlace?.id === place.id ? 'selected' : ''}`}
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
                  <p className="place-meta">
                    {place.department}
                  </p>
                  <p className="place-description">{place.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <span>Made with ❤️ for Guatemala</span>
      </div>
    </aside>
  );
}
