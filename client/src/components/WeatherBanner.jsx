export default function WeatherBanner({ itinerary, meta }) {
  if (!meta?.weatherFetched) {
    return (
      <div className="rounded-sm border border-bark-200 bg-bark-50 p-4 text-sm text-bark-500 font-body">
        Weather data unavailable — plan for variable conditions.
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-bark-200 bg-bark-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⛅</span>
        <span className="text-xs font-body font-semibold uppercase tracking-widest text-bark-500">
          Weather Context
        </span>
      </div>
      <p className="text-xs text-bark-500 font-body mb-2">{meta.weatherLocation}</p>
      <p className="text-sm text-bark-800 font-body leading-relaxed">
        {itinerary.weatherSummary}
      </p>
    </div>
  );
}
