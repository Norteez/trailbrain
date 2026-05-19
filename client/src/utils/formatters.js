export function formatDistance(miles) {
  if (miles === undefined || miles === null) return '—';
  return miles < 0.5
    ? `${(miles * 5280).toFixed(0)} ft`
    : `${miles.toFixed(1)} mi`;
}

export function formatElevation(feet) {
  if (feet === undefined || feet === null) return '—';
  return feet >= 1000
    ? `${(feet / 1000).toFixed(1)}k ft`
    : `${Math.round(feet)} ft`;
}

export const difficultyColors = {
  Easy:      'bg-moss-100 text-moss-800',
  Moderate:  'bg-bark-100 text-bark-800',
  Strenuous: 'bg-amber-100 text-amber-800',
  Expert:    'bg-red-100 text-red-800',
};

export const severityStyles = {
  Warning: {
    container: 'bg-red-50 border-l-4 border-danger',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
  },
  Caution: {
    container: 'bg-amber-50 border-l-4 border-caution',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
  },
  Info: {
    container: 'bg-blue-50 border-l-4 border-info',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
  },
};
