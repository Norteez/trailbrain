import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 90000, // AI generation can take 20-40 seconds
  headers: { 'Content-Type': 'application/json' },
});

export async function generateItinerary(tripData) {
  const { data } = await api.post('/itinerary', tripData);
  return data;
}
