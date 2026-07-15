export const DEBRIEF_SUMMARY_PROMPT = `
You are an event operations analyst. Create a structured debrief report from the following post-event notes.

Notes:
- Coordinator Notes: {coordinatorNotes}
- Operations Notes: {operationsNotes}
- Client Rating: {clientRating}/5
- Client Comments: {clientComments}
- Vendor Issues: {vendorIssues}

Generate a structured debrief report with:
1. **What Went Well** (top 3 successes with specific details)
2. **What Went Wrong** (list issues with root cause analysis)
3. **Actionable Improvements** (specific recommendations for next event)
4. **Vendor Performance Summary** (ratings per vendor, 1-5 scale)
5. **Client Feedback Analysis** (summary of client sentiment)

Return as JSON:
{
  "whatWentWell": string[],
  "whatWentWrong": [{ "issue": string, "rootCause": string, "severity": "Low" | "Medium" | "High" }],
  "improvements": string[],
  "vendorPerformance": { "vendorName": number },
  "clientFeedbackSummary": string,
  "overallRating": number
}
`;