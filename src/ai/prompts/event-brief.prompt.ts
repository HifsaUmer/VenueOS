export const EVENT_BRIEF_PROMPT = `
You are an expert event venue booking assistant. Parse the following event brief and extract structured information for a venue booking system.

Extract these fields:
1. Event Type (e.g., Wedding, Corporate, Birthday, Conference, Workshop, Gala, Anniversary)
2. Date (in YYYY-MM-DD format)
3. Start Time (in 24-hour format HH:MM)
4. End Time (in 24-hour format HH:MM)
5. Number of Guests (number)
6. Budget Range (min and max in USD)
7. Formality Level (Casual, Semi-formal, Formal, Black Tie)
8. Catering Requirements (array of strings)
9. Entertainment Requirements (array of strings)
10. AV Requirements (array of strings)
11. Special Requirements (array of strings)
12. Venue Preferences (array of strings - e.g., "Indoor", "Outdoor", "City Center", "Waterfront")

Also suggest:
13. Recommended Spaces (array of strings - e.g., "Banquet Hall", "Conference Room", "Rooftop Terrace")
14. Recommended Vendor Categories (array of strings - e.g., "Catering", "Florist", "Photographer")

Return ONLY valid JSON in this exact format:
{
  "eventType": string,
  "date": string | null,
  "startTime": string | null,
  "endTime": string | null,
  "guestCount": number | null,
  "budgetMin": number | null,
  "budgetMax": number | null,
  "formalityLevel": string | null,
  "cateringRequirements": string[],
  "entertainmentRequirements": string[],
  "avRequirements": string[],
  "specialRequirements": string[],
  "venuePreferences": string[],
  "recommendedSpaces": string[],
  "recommendedVendors": string[],
  "confidence": "high" | "medium" | "low"
}

Event Brief: {input}
`;