import { formatDistance, formatElevation } from '../utils/formatters';

export default function ItineraryCard({ day }) {
  return (
    <div className="bg-white/90 border border-bark-200 rounded-sm p-5">

      <div className="flex items-center gap-3 mb-4">
        <span className="bg-bark-900 text-bark-50 font-mono text-xs px-2 py-0.5 rounded-full">
          Day {day.dayNumber}
        </span>
        <h3 className="font-display text-xl font-semibold text-bark-900">
          {day.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-6 mb-4 text-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-bark-400 block">Distance</span>
          <span className="font-semibold text-bark-800">{formatDistance(day.totalDistanceMiles)}</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-bark-400 block">Elevation Gain</span>
          <span className="font-semibold text-bark-800">{formatElevation(day.totalElevationGainFt)}</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-bark-400 block">Camp</span>
          <span className="font-semibold text-bark-800">{day.campsite}</span>
        </div>
      </div>

      <ul className="mb-4 space-y-2 border-t border-bark-100 pt-4">
        {day.activities.map((activity, idx) => (
          <li key={idx} className="flex gap-3 text-sm">
            <span className="text-bark-400 font-mono text-xs w-16 flex-shrink-0 pt-0.5">
              {activity.time}
            </span>
            <span className="text-bark-800 font-body leading-snug flex-1">
              {activity.description}
              {activity.duration && (
                <span className="text-bark-400 ml-1">({activity.duration})</span>
              )}
              {activity.distanceMiles && (
                <span className="text-bark-400 ml-1">· {formatDistance(activity.distanceMiles)}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <span className="text-xs bg-bark-100 text-bark-600 px-2 py-0.5 rounded-full font-body">
          {day.terrain}
        </span>
      </div>

      <blockquote className="border-l-2 border-bark-300 pl-3 mb-3">
        <p className="italic text-sm text-bark-600 font-body leading-relaxed">
          {day.notes}
        </p>
      </blockquote>

      <p className="text-sm text-bark-500 font-body flex items-start gap-1.5">
        <span className="flex-shrink-0">⛅</span>
        {day.weatherContext}
      </p>

    </div>
  );
}
