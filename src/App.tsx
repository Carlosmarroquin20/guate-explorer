import { useState } from 'react';
import Map from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import places from './data/places.json';
import type { Place } from './types';
import './App.css';

const typedPlaces = places as Place[];

function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };

  const handlePlaceDeselect = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="app">
      <Sidebar
        places={typedPlaces}
        selectedPlace={selectedPlace}
        onPlaceSelect={handlePlaceSelect}
        onPlaceDeselect={handlePlaceDeselect}
      />
      <main className="map-wrapper">
        <Map
          places={typedPlaces}
          selectedPlace={selectedPlace}
          onPlaceSelect={handlePlaceSelect}
        />
      </main>
    </div>
  );
}

export default App;
