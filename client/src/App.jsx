import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [view, setView] = useState('landing');
  const [itinerary, setItinerary] = useState(null);
  const [meta, setMeta] = useState(null);

  function handleItineraryGenerated(data) {
    setItinerary(data.itinerary);
    setMeta(data.meta);
    setView('results');
  }

  function handleReset() {
    setItinerary(null);
    setMeta(null);
    setView('landing');
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
      {view === 'landing' && (
        <LandingPage onItineraryGenerated={handleItineraryGenerated} />
      )}
      {view === 'results' && (
        <ResultsPage
          itinerary={itinerary}
          meta={meta}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
