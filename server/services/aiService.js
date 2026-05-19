const Anthropic = require('@anthropic-ai/sdk');
const { buildSystemPrompt, buildUserMessage } = require('./promptBuilder');
const { validateItinerary } = require('../utils/itinerarySchema');

const client = new Anthropic();
const MAX_RETRIES = 2;
const MODEL = 'claude-sonnet-4-5';

async function generateItinerary(tripRequest, weatherData) {
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(tripRequest, weatherData);

  let lastRawResponse = null;
  let lastValidationErrors = null;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    let messageContent;

    if (attempt === 1) {
      messageContent = userMessage;
    } else {
      // Feed the broken response + exact errors back to Claude for self-correction
      messageContent = `${userMessage}

---
CORRECTION REQUEST (Attempt ${attempt} of ${MAX_RETRIES + 1}):
Your previous response failed JSON validation with these errors:
${JSON.stringify(lastValidationErrors, null, 2)}

Here was your previous response — fix only the structural/type errors above, preserve the content:
${lastRawResponse}

Return ONLY the corrected JSON.`;
    }

    let rawText;
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: messageContent }],
      });
      rawText = response.content[0].text.trim();
      console.log(`[AIService] Attempt ${attempt} — response received (${rawText.length} chars)`);
    } catch (apiError) {
      throw new Error(`Claude API error: ${apiError.message}`);
    }

    // Strip any accidental markdown code fences
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '');

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.warn(`[AIService] Attempt ${attempt} — JSON.parse failed:`, parseError.message);
      lastRawResponse = cleaned;
      lastValidationErrors = { jsonParseError: parseError.message, preview: cleaned.slice(0, 200) };
      if (attempt > MAX_RETRIES) break;
      continue;
    }

    const validation = validateItinerary(parsed);
    if (validation.valid) {
      console.log(`[AIService] Attempt ${attempt} — validation passed`);
      return { itinerary: validation.data, attempts: attempt };
    }

    console.warn(`[AIService] Attempt ${attempt} — Zod validation failed:`, JSON.stringify(validation.errors));
    lastRawResponse = cleaned;
    lastValidationErrors = validation.errors;
    if (attempt > MAX_RETRIES) break;
  }

  throw new Error(
    `Failed to generate a valid itinerary after ${MAX_RETRIES + 1} attempts. ` +
    `Last errors: ${JSON.stringify(lastValidationErrors)}`
  );
}

module.exports = { generateItinerary };
