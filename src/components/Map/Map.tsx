import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Place } from '../../types';
import { categoryIcons, getCategoryColor } from '../../utils/icons';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';

interface MapProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
}

// Guatemala center coordinates
const GUATEMALA_CENTER: [number, number] = [15.5, -90.25];
const DEFAULT_ZOOM = 7;
const SELECTED_ZOOM = 10;

function MapController({ selectedPlace }: { selectedPlace: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo(
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
        SELECTED_ZOOM,
        { duration: 1 }
      );
    }
  }, [selectedPlace, map]);

  return null;
}

export default function Map({ places, selectedPlace, onPlaceSelect }: MapProps) {
  return (
    <MapContainer
      center={GUATEMALA_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedPlace={selectedPlace} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.coordinates.lat, place.coordinates.lng]}
          icon={categoryIcons[place.category]}
          eventHandlers={{
            click: () => onPlaceSelect(place),
          }}
        >
          <Popup>
            <div className="popup-content">
              <h3 className="popup-title">{place.name}</h3>
              <p className="popup-description">{place.description}</p>
              <div className="popup-meta">
                <span
                  className="popup-category"
                  style={{ backgroundColor: getCategoryColor(place.category) }}
                >
                  {place.category}
                </span>
                <span className="popup-department">{place.department}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
