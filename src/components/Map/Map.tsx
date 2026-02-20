import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Place } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with bundlers
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  places: Place[];
}

// Guatemala center coordinates
const GUATEMALA_CENTER: [number, number] = [15.5, -90.25];
const DEFAULT_ZOOM = 7;

export default function Map({ places }: MapProps) {
  return (
    <MapContainer
      center={GUATEMALA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.coordinates.lat, place.coordinates.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>{place.name}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                {place.description}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                {place.department} · {place.category}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
