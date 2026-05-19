export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center max-w-md mx-auto">
      <div className="text-3xl mb-3">⚠</div>
      <p className="text-bark-800 font-body mb-4">
        {message || 'Something went wrong generating your itinerary.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-bark-700 hover:bg-bark-800 text-bark-50 font-body font-semibold px-6 py-2 rounded-sm text-sm uppercase tracking-wide transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
