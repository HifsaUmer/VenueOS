export const CONTRACT_CLAUSE_PROMPT = `
You are a legal assistant for event venues. Generate a comprehensive event contract based on the following details.

Event Details:
- Event Type: {eventType}
- Date: {date}
- Guest Count: {guestCount}
- Selected Services: {selectedServices}
- Total Value: {totalValue}  
- Client Tier: {clientTier} (standard / premium / corporate)
- Lead Time: {leadTime} days before event

Generate a complete contract with these sections:
1. **Venue Hire Terms**: Include hire period, access times, cleaning requirements
2. **Catering Terms**: If applicable, include menu confirmation deadline, dietary requirements policy
3. **Equipment & AV Terms**: Usage rights, damage liability
4. **Payment Schedule**: Based on total value and client tier
5. **Cancellation Policy**: Scaled to lead time and event value
6. **Liability Clauses**: Standard venue liability limitations
7. **Force Majeure**: Standard clause
8. **Insurance Requirements**: Minimum coverage amounts
9. **Signatory Lines**: Both parties

Format as a professional contract with section headers and numbered clauses.

Contract:
`;