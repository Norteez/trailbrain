const { z } = require('zod');

const ActivitySchema = z.object({
  time: z.string().describe('Approximate time, e.g. "Morning", "07:00"'),
  description: z.string().min(10),
  distanceMiles: z.number().min(0).optional(),
  elevationGainFt: z.number().optional(),
  duration: z.string().optional().describe('e.g. "3-4 hours"'),
});

const DaySchema = z.object({
  dayNumber: z.number().int().min(1),
  title: z.string().min(3).describe('Evocative day title, e.g. "Into the Wilderness"'),
  date: z.string().optional(),
  campsite: z.string().describe("Name or description of the night's camp"),
  totalDistanceMiles: z.number().min(0),
  totalElevationGainFt: z.number().min(0),
  activities: z.array(ActivitySchema).min(1),
  terrain: z.string().describe('Brief terrain description'),
  notes: z.string().describe('Trail conditions, hazards, or tips for this day'),
  weatherContext: z.string().describe('How the weather affects this specific day'),
});

const GearItemSchema = z.object({
  item: z.string(),
  category: z.enum(['Navigation', 'Shelter', 'Clothing', 'Food & Water', 'Safety', 'Tools', 'Optional']),
  priority: z.enum(['Essential', 'Recommended', 'Optional']),
  note: z.string().optional(),
});

const WarningSchema = z.object({
  type: z.enum(['Elevation', 'Weather', 'Wildlife', 'Water', 'Permit', 'Terrain', 'General']),
  severity: z.enum(['Info', 'Caution', 'Warning']),
  message: z.string(),
});

const ItinerarySchema = z.object({
  tripTitle: z.string().min(5).describe('Evocative name for the trip'),
  region: z.string().describe('General geographic region'),
  difficulty: z.enum(['Easy', 'Moderate', 'Strenuous', 'Expert']),
  totalDays: z.number().int().min(1).max(14),
  totalDistanceMiles: z.number().min(0),
  totalElevationGainFt: z.number().min(0),
  bestMonthsToVisit: z.array(z.string()).optional(),
  weatherSummary: z.string().describe('Summary of weather conditions at time of planning'),
  days: z.array(DaySchema).min(1),
  gear: z.array(GearItemSchema).min(5),
  warnings: z.array(WarningSchema),
  permits: z.string().describe('Permit requirements or "None required"'),
  trailhead: z.object({
    name: z.string(),
    parkingNotes: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lon: z.number().optional(),
    }).optional(),
  }),
  generatedAt: z.string().describe('ISO timestamp of generation'),
});

function validateItinerary(rawData) {
  const result = ItinerarySchema.safeParse(rawData);
  if (result.success) {
    return { valid: true, data: result.data, errors: null };
  }
  return {
    valid: false,
    data: null,
    errors: result.error.flatten(),
  };
}

module.exports = { ItinerarySchema, validateItinerary };
