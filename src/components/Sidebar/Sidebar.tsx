import type { Place } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/icons';
import ImageGallery from '../ImageGallery/ImageGallery';
import './Sidebar.css';

interface SidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  onPlaceDeselect: () => void;
}

export default function Sidebar({
  places,
  selectedPlace,
  onPlaceSelect,
  onPlaceDeselect,
}: SidebarProps) {
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
        {selectedPlace ? (
          <div className="place-detail">
            <button className="back-button" onClick={onPlaceDeselect}>
              ← Back to list
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

            <ImageGallery images={selectedPlace.images} />

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
            <div className="places-count">{places.length} places to explore</div>

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
        <span>Made with ❤️ for Guatemala</span>
      </div>
    </aside>
  );
}
