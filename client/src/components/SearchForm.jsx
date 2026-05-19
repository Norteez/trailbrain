import { useState, useEffect } from 'react';
import { useItinerary } from '../hooks/useItinerary';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const DIFFICULTIES = ['Easy', 'Moderate', 'Strenuous', 'Expert'];

const inputClass =
  'w-full border border-bark-300 bg-white rounded-sm px-3 py-2 text-bark-900 font-body text-sm focus:outline-none focus:ring-2 focus:ring-moss-400';

const labelClass =
  'block text-xs font-body font-semibold uppercase tracking-widest text-bark-600 mb-1.5';

export default function SearchForm({ onItineraryGenerated }) {
  const { loading, error, data, submit } = useItinerary();

  const [query, setQuery]           = useState('');
  const [days, setDays]             = useState(5);
  const [difficulty, setDifficulty] = useState('Moderate');
  const [location, setLocation]     = useState('');
  const [startDate, setStartDate]   = useState('');

  useEffect(() => {
    if (data) onItineraryGenerated(data);
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    await submit({ query, days, difficulty, location, startDate });
  }

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip description */}
      <div>
        <label htmlFor="query" className={labelClass}>Describe your trip</label>
        <textarea
          id="query"
          required
          rows={4}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='5-day backpacking trip near Asheville, moderate difficulty, no snow'
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Days + Difficulty row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="days" className={labelClass}>Days</label>
          <select
            id="days"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'day' : 'days'}</option>
            ))}
          </select>
        </div>

        <div>
          <span className={labelClass}>Difficulty</span>
          <div className="flex gap-1 flex-wrap">
            {DIFFICULTIES.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-3 py-1.5 text-xs font-body font-semibold rounded-sm border transition-colors ${
                  difficulty === level
                    ? 'bg-bark-900 text-bark-50 border-bark-900'
                    : 'bg-white text-bark-600 border-bark-200 hover:border-bark-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className={labelClass}>Region or trailhead</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Asheville, NC"
            className={inputClass}
          />
          <p className="text-xs text-bark-400 mt-1 font-body">Optional — improves weather accuracy</p>
        </div>

        <div>
          <label htmlFor="startDate" className={labelClass}>Start date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!query.trim()}
        className="w-full bg-moss-600 hover:bg-moss-700 disabled:bg-bark-300 disabled:cursor-not-allowed text-white font-body font-semibold px-8 py-3 rounded-sm uppercase tracking-wide text-sm transition-colors"
      >
        Generate Itinerary
      </button>
    </form>
  );
}
