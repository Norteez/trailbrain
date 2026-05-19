import { useState } from 'react';
import { generateItinerary } from '../utils/api';

// TODO(human): Implement this custom hook.
//
// Interface this hook must expose:
//   const { loading, error, data, submit } = useItinerary();
//
// State:
//   loading  — boolean, true while the API call is in flight
//   error    — string | null, the error message if the call failed
//   data     — { itinerary, meta } | null, the successful response
//
// submit(formData) — async function that:
//   1. Sets loading = true, clears error
//   2. Calls generateItinerary(formData) from '../utils/api'
//   3. On success: sets data, sets loading = false
//   4. On error: sets error to the message string, sets loading = false
//   5. Uses try/catch/finally so loading always resets
//
// generateItinerary() is already imported above. It takes a plain object
// (the form fields) and returns { itinerary, meta } on success,
// or throws an error with a .message property on failure.

export function useItinerary() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  async function submit(formData) {
    setLoading(true);
    setError(null);

    try {
      const result = await generateItinerary(formData);
      setData(result);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, submit }; 
}
