import WeatherBanner from '../components/WeatherBanner';
import GearChecklist from '../components/GearChecklist';
import ItineraryCard from '../components/ItineraryCard';
import ElevationWarning from '../components/ElevationWarning';
import { difficultyColors, formatDistance, formatElevation } from '../utils/formatters';

export default function ResultsPage({ itinerary, meta, onReset }) {
  const diffClass = difficultyColors[itinerary.difficulty] || 'bg-bark-100 text-bark-800';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-paper)' }}>
      {/* Top bar */}
      <div
        className="px-6 py-4 border-b border-bark-200"
        style={{ backgroundColor: 'var(--color-bark-900)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span
            className="text-xl font-bold text-bark-50"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TrailBrain
          </span>
          <button
            onClick={onReset}
            className="text-sm font-body text-bark-300 hover:text-bark-50 transition-colors uppercase tracking-wide"
          >
            ← Plan another trip
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Trip header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full uppercase tracking-widest ${diffClass}`}>
              {itinerary.difficulty}
            </span>
            {meta?.generationAttempts > 1 && (
              <span className="text-xs text-bark-400 font-body">
                Generated in {meta.generationAttempts} attempts
              </span>
            )}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-bark-900 mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {itinerary.tripTitle}
          </h1>
          <p className="text-bark-500 font-body">{itinerary.region}</p>

          {/* Trip stats */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm font-body">
            <div>
              <span className="text-bark-400 text-xs uppercase tracking-widest block">Duration</span>
              <span className="text-bark-800 font-semibold">{itinerary.totalDays} days</span>
            </div>
            <div>
              <span className="text-bark-400 text-xs uppercase tracking-widest block">Distance</span>
              <span className="text-bark-800 font-semibold">{formatDistance(itinerary.totalDistanceMiles)}</span>
            </div>
            <div>
              <span className="text-bark-400 text-xs uppercase tracking-widest block">Elevation Gain</span>
              <span className="text-bark-800 font-semibold">{formatElevation(itinerary.totalElevationGainFt)}</span>
            </div>
            <div>
              <span className="text-bark-400 text-xs uppercase tracking-widest block">Trailhead</span>
              <span className="text-bark-800 font-semibold">{itinerary.trailhead.name}</span>
            </div>
            <div>
              <span className="text-bark-400 text-xs uppercase tracking-widest block">Permits</span>
              <span className="text-bark-800 font-semibold">{itinerary.permits}</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <WeatherBanner itinerary={itinerary} meta={meta} />

            {itinerary.trailhead.parkingNotes && (
              <div className="rounded-sm border border-bark-200 bg-bark-50 p-4">
                <p className="text-xs font-body font-semibold uppercase tracking-widest text-bark-500 mb-1">
                  Parking
                </p>
                <p className="text-sm font-body text-bark-700">
                  {itinerary.trailhead.parkingNotes}
                </p>
              </div>
            )}

            <GearChecklist gear={itinerary.gear} />
          </aside>

          {/* Main content */}
          <main className="lg:col-span-2">
            {/* Warnings */}
            {itinerary.warnings.length > 0 && (
              <section className="mb-8">
                <h2
                  className="text-xs font-body font-semibold uppercase tracking-widest text-bark-500 mb-3"
                >
                  Heads Up
                </h2>
                {itinerary.warnings.map((warning, idx) => (
                  <ElevationWarning key={idx} warning={warning} />
                ))}
              </section>
            )}

            {/* Day-by-day itinerary */}
            <section>
              <h2
                className="text-xs font-body font-semibold uppercase tracking-widest text-bark-500 mb-4"
              >
                Day by Day
              </h2>
              <div className="space-y-4">
                {itinerary.days.map(day => (
                  <ItineraryCard key={day.dayNumber} day={day} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
