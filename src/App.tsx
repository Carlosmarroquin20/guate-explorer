import Map from './components/Map/Map';
import places from './data/places.json';
import type { Place } from './types';

function App() {
  return <Map places={places as Place[]} />;
}

export default App;
