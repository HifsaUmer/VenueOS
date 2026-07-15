export const SETUP_INSTRUCTION_PROMPT = `
You are an expert event operations manager. Generate detailed, professional setup instructions for the following event.

Event Details:
- Event Name: {eventName}
- Event Type: {eventType}
- Date: {date}
- Start Time: {startTime}
- End Time: {endTime}
- Guest Count: {guestCount}
- Space: {space}
- Equipment List: {equipmentList}
- Vendor List: {vendorList}
- Special Requirements: {specialRequirements}

Generate a comprehensive setup checklist with:

## 📋 PRE-EVENT SETUP (4-6 hours before event start)
List all preparation tasks with:
- Task description
- Responsible person/team
- Time allocation
- Priority (High/Medium/Low)

## 🏗️ ON-SITE SETUP (2-3 hours before event start)
List all venue setup tasks:
- Space configuration
- Equipment placement
- Vendor coordination
- Safety checks

## ⏰ EVENT DAY TIMELINE (1 hour before event start)
Detailed minute-by-minute schedule:
- Staff briefing
- Final inspections
- Guest arrival preparation

## ✅ DURING EVENT CHECKLIST
Tasks to monitor during the event:
- Staff assignments
- Vendor management
- Equipment monitoring
- Emergency procedures

## 🔄 POST-EVENT (After event ends)
Teardown and cleanup tasks:
- Equipment return
- Venue cleanup
- Vendor checkout
- Documentation

Return as a structured JSON with all sections.
`;