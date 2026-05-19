export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div
        className="w-16 h-16 rounded-full border-4 border-bark-200 border-t-moss-500 animate-spin"
        role="status"
        aria-label="Loading"
      />
      <div className="text-center">
        <p className="font-display text-xl italic text-bark-700">
          TrailBrain is charting your route...
        </p>
        <p className="text-sm text-bark-400 mt-2 font-body">
          Fetching weather and generating your itinerary
        </p>
      </div>
    </div>
  );
}
