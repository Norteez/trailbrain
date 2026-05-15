# TrailBrain

**AI-powered trip planning for hikers and overlanders.**

You describe a trip. TrailBrain handles the rest — fetching live weather, generating a day-by-day itinerary, building a gear checklist, and flagging anything that could go sideways before you leave the trailhead.

> *"5-day backpacking loop near Asheville, moderate difficulty, starting mid-June"* → structured itinerary in under 30 seconds.

---

## How It Works

1. You describe your trip in plain English — destination, duration, difficulty, any conditions
2. TrailBrain geocodes your location and fetches live weather (current + 5-day forecast)
3. Your request + weather data gets sent to Claude with a strict JSON schema
4. Claude returns a structured itinerary — validated, retried if malformed, then rendered
5. You pack your bag and go

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Anthropic Claude API (`claude-sonnet-4-5`) |
| Weather | OpenWeather API (Geocoding + Current + 5-Day Forecast) |
| Validation | Zod |

---

## Engineering Notes

### The Core Problem: Reliable Structured Output from an LLM

Getting an LLM to return valid, consistently shaped JSON — every single time — is the non-trivial part of this project. Language models are non-deterministic. They occasionally wrap JSON in markdown fences, drop required fields, or return the wrong enum value. Any of those breaks your UI if you're not handling it.

My approach is a three-layer system:

**1. Schema injection in the system prompt**
A readable JSON schema is embedded directly in the system prompt so Claude knows exactly what structure to produce. Not a vague "return JSON" instruction — a field-by-field specification with type annotations and enum constraints.

**2. Zod validation on every response**
Every Claude response is parsed against a strict Zod schema before it ever touches the frontend. Type mismatches, missing required fields, invalid enum values — all caught immediately with structured error output.

**3. Feedback-loop retry**
If validation fails, I don't throw an error and give up. I send Claude the original prompt + the broken response + the exact Zod validation errors, and ask it to fix only the structural issues while preserving the content. This resolves the vast majority of validation failures without losing itinerary quality.

The mental model: treat AI output the same way you'd treat data from an untrusted external API. Validate it. Don't assume it.

### Weather Enrichment Pipeline

Before the AI call, OpenWeather's geocoding API converts the user's location string to coordinates. Current conditions and a 5-day forecast are fetched in parallel and injected into the prompt as structured context. This grounds Claude's recommendations in real conditions — actual precipitation probability, real temperature ranges — rather than generic seasonal averages. It also means the gear list adjusts: if rain is forecasted, you're getting a rain cover on the pack list.

### Clean Service Architecture

The server is organized around three independent services with clear interfaces:

- `weatherService.js` — location geocoding, weather aggregation, graceful fallback if the API is down
- `promptBuilder.js` — deterministic prompt construction with no API coupling (independently testable)
- `aiService.js` — Claude API calls, JSON parsing, Zod validation, retry logic

The route handler is intentionally thin — it orchestrates these services, not implements them. This separation makes each piece easy to test and reason about independently.

---

## Running Locally

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- An [OpenWeather API key](https://openweathermap.org/api) (free tier works)

### Setup

```bash
# Clone the repo
git clone https://github.com/Norteez/trailbrain.git
cd trailbrain

# Server setup
cd server
cp .env.example .env
# Add your API keys to .env
npm install
npm run dev
# → Runs on http://localhost:3001

# Client setup (new terminal tab)
cd client
npm install
npm run dev
# → Runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the Express server automatically — no CORS configuration needed in development.

---

## Project Structure

```
trailbrain/
├── client/                   # React + Vite + Tailwind
│   ├── public/
│   │   ├── grain.svg         # SVG noise texture for paper effect
│   │   └── topo-pattern.svg  # Topographic line tile
│   └── src/
│       ├── components/       # UI components
│       ├── hooks/            # useItinerary, useLocalStorage
│       ├── pages/            # LandingPage, ResultsPage
│       ├── styles/           # Global CSS + Tailwind base
│       └── utils/            # API client, formatters
└── server/
    ├── index.js              # Express entry point
    ├── routes/
    │   └── itinerary.js      # POST /api/itinerary
    ├── services/
    │   ├── aiService.js      # Claude API + validation + retry
    │   ├── weatherService.js # OpenWeather geocoding + forecast
    │   └── promptBuilder.js  # Prompt construction (testable)
    ├── middleware/
    │   ├── validate.js       # Request body validation
    │   └── errorHandler.js   # Normalized error responses
    └── utils/
        └── itinerarySchema.js # Zod schema — the system's contract
```

---

## Itinerary Schema

The AI returns a structured object. Every field is validated against a Zod schema before the response leaves the server.

```json
{
  "tripTitle": "Into the Black Mountains",
  "region": "Black Mountains, NC",
  "difficulty": "Moderate",
  "totalDays": 5,
  "totalDistanceMiles": 42.3,
  "totalElevationGainFt": 8400,
  "weatherSummary": "Mild days in the low 60s, cool nights near 40°F, 30% chance of afternoon showers mid-week.",
  "days": [
    {
      "dayNumber": 1,
      "title": "The Approach",
      "campsite": "Deep Gap Campsite",
      "totalDistanceMiles": 7.2,
      "totalElevationGainFt": 1800,
      "activities": [...],
      "terrain": "Hardwood forest, rocky switchbacks",
      "notes": "Trailhead parking fills early on weekends.",
      "weatherContext": "Clear skies expected — ideal for gaining elevation."
    }
  ],
  "gear": [
    { "item": "Rain jacket", "category": "Clothing", "priority": "Essential" },
    ...
  ],
  "warnings": [
    { "type": "Weather", "severity": "Caution", "message": "Afternoon thunderstorms possible Wednesday. Plan to be below treeline by 2pm." }
  ],
  "permits": "None required for Black Mountains area",
  "trailhead": {
    "name": "Black Mountain Campground Trailhead",
    "parkingNotes": "Fee station, $5/day. Fills by 9am on weekends."
  }
}
```

Full schema definition: [`server/utils/itinerarySchema.js`](server/utils/itinerarySchema.js)

---

## Design Direction

The UI is intentionally not a standard SaaS dashboard. The aesthetic references topographic maps and field notebooks — earthy, textured, utilitarian. Custom Tailwind color tokens (`bark-*` for warm browns, `moss-*` for muted greens), a grain SVG overlay for the paper texture, and a Fraunces + Space Grotesk type pairing.

---

## Roadmap

- [ ] Elevation profile chart (Chart.js — the data is already in the schema)
- [ ] Export itinerary to PDF
- [ ] Trailhead map via MapLibre GL JS
- [ ] Permit lookup via Recreation.gov API
- [ ] React Native mobile app
- [ ] Saved trips (requires auth + database)

---

## License

MIT
