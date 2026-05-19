import SearchForm from '../components/SearchForm';

export default function LandingPage({ onItineraryGenerated }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header
        className="relative overflow-hidden px-6 py-16 text-center"
        style={{ backgroundColor: '#3d2d1d' }}
      >
        {/* Topographic background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('/topo-pattern.svg')", backgroundRepeat: 'repeat' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-bark-300 mb-3">
            AI Trip Planner
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 text-bark-50"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TrailBrain
          </h1>
          <p className="text-lg text-bark-200 font-body max-w-lg mx-auto leading-relaxed">
            Describe your trip. Get a structured itinerary with gear list, elevation warnings,
            and live weather — in under 30 seconds.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 py-12 max-w-2xl mx-auto w-full">
        <SearchForm onItineraryGenerated={onItineraryGenerated} />
      </main>

      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-bark-400 font-body">
          Powered by Claude · OpenWeather · Built for the trail
        </p>
      </footer>
    </div>
  );
}
