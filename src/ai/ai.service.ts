import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AiRequestDto, AiFeature } from './dto/ai-request.dto';
import { EVENT_BRIEF_PROMPT } from './prompts/event-brief.prompt';
import { CONTRACT_CLAUSE_PROMPT } from './prompts/contract-clause.prompt';
import { DEBRIEF_SUMMARY_PROMPT } from './prompts/debrief-summary.prompt';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly useMock: boolean;

 constructor(
  private configService: ConfigService,
  private httpService: HttpService,
) {
  this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';  // Add <string> and || ''
  this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  this.useMock = this.configService.get('USE_MOCK_AI') === 'true' || !this.apiKey;
  
  if (this.useMock) {
    console.warn('⚠️ AI service running in MOCK mode');
  }
}

  async processRequest(aiRequest: AiRequestDto) {
    const { feature, input, context } = aiRequest;

    // If no API key, use fallback
    if (this.useMock) {
      return this.getFallbackResponse(feature, input);
    }

    try {
      let prompt: string;
      let systemPrompt: string;
      let temperature = 0.3;

      switch (feature) {
        case AiFeature.EVENT_BRIEF_INTERPRETER:
          prompt = EVENT_BRIEF_PROMPT.replace('{input}', input);
          systemPrompt = 'You are an expert event venue booking assistant. Always return valid JSON.';
          break;

        case AiFeature.CONTRACT_CLAUSE_ASSISTANT:
          const contractContext = context || {};
          prompt = CONTRACT_CLAUSE_PROMPT
            .replace('{eventType}', contractContext.eventType || 'Event')
            .replace('{date}', contractContext.date || 'TBD')
            .replace('{guestCount}', contractContext.guestCount || '0')
            .replace('{selectedServices}', contractContext.selectedServices?.join(', ') || 'Venue hire')
            .replace('{totalValue}', contractContext.totalValue || '0')
            .replace('{clientTier}', contractContext.clientTier || 'standard')
            .replace('{leadTime}', contractContext.leadTime || '30');
          systemPrompt = 'You are a legal assistant for event venues. Generate professional event contracts.';
          temperature = 0.2;
          break;

        case AiFeature.POST_EVENT_DEBRIEF:
          const debriefContext = context || {};
          prompt = DEBRIEF_SUMMARY_PROMPT
            .replace('{coordinatorNotes}', debriefContext.coordinatorNotes || 'No notes provided')
            .replace('{operationsNotes}', debriefContext.operationsNotes || 'No notes provided')
            .replace('{clientRating}', debriefContext.clientRating || '0')
            .replace('{clientComments}', debriefContext.clientComments || 'No comments provided')
            .replace('{vendorIssues}', debriefContext.vendorIssues?.join(', ') || 'No issues reported');
          systemPrompt = 'You are an event operations analyst. Create structured debrief reports. Always return valid JSON.';
          temperature = 0.3;
          break;

        default:
          throw new BadRequestException(`Unknown AI feature: ${feature}`);
      }

      const response = await this.callOpenAI(prompt, systemPrompt, temperature);
      
      // Try to parse JSON response
      try {
        const parsedData = JSON.parse(response);
        return {
          success: true,
          data: parsedData,
        };
      } catch (parseError) {
        // If parsing fails, return raw response with a warning
        return {
          success: true,
          data: {
            raw: response,
            parseError: 'Failed to parse as JSON',
          },
          message: 'AI returned non-JSON response',
        };
      }

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Graceful degradation: return fallback
      return this.getFallbackResponse(feature, input);
    }
  }

  private async callOpenAI(prompt: string, systemPrompt: string, temperature: number): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            temperature,
            max_tokens: 1000,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to call AI service');
    }
  }

  private getFallbackResponse(feature: AiFeature, input: string) {
    const fallbacks = {
      [AiFeature.EVENT_BRIEF_INTERPRETER]: {
        success: true,
        fallbackUsed: true,
        data: {
          eventType: 'Event',
          date: null,
          startTime: null,
          endTime: null,
          guestCount: null,
          budgetMin: null,
          budgetMax: null,
          formalityLevel: null,
          cateringRequirements: [],
          entertainmentRequirements: [],
          avRequirements: [],
          specialRequirements: [],
          venuePreferences: [],
          recommendedSpaces: ['Banquet Hall', 'Conference Room'],
          recommendedVendors: ['Catering', 'AV Equipment'],
          confidence: 'low',
          note: 'AI service unavailable - using fallback response',
        },
        message: 'AI service is currently unavailable. Using default template.',
      },

      [AiFeature.CONTRACT_CLAUSE_ASSISTANT]: {
        success: true,
        fallbackUsed: true,
        data: {
          contract: `
EVENT VENUE CONTRACT

1. VENUE HIRE TERMS
The venue is hired for the event described above. Access will be provided 2 hours before the event start time. All equipment must be removed by 2 hours after the event end time.

2. PAYMENT SCHEDULE
- 50% deposit required to confirm booking
- Remaining 50% due 14 days before the event
- Late payments subject to 5% penalty

3. CANCELLATION POLICY
- 90+ days before event: Full refund of deposit
- 60-89 days before event: 50% refund
- 30-59 days before event: 25% refund
- Less than 30 days: No refund

4. LIABILITY
The venue is not liable for loss or damage to client property. Client must provide proof of public liability insurance.

5. FORCE MAJEURE
Neither party shall be liable for failure to perform due to circumstances beyond their control.

6. GOVERNING LAW
This contract shall be governed by the laws of the jurisdiction.

Signed: __________________  Date: ________

Signed: __________________  Date: ________
          `.trim(),
          sections: ['Venue Hire Terms', 'Payment Schedule', 'Cancellation Policy', 'Liability', 'Force Majeure'],
        },
        message: 'AI service is currently unavailable. Using standard contract template.',
      },

      [AiFeature.POST_EVENT_DEBRIEF]: {
        success: true,
        fallbackUsed: true,
        data: {
          whatWentWell: ['Event was completed successfully', 'Staff were professional'],
          whatWentWrong: [],
          improvements: ['Review event process for improvements'],
          vendorPerformance: {},
          clientFeedbackSummary: 'No feedback recorded',
          overallRating: 3,
          note: 'AI service unavailable - using fallback response',
        },
        message: 'AI service is currently unavailable. Using default debrief template.',
      },
    };

    return fallbacks[feature] || {
      success: false,
      error: 'Unknown feature',
      fallbackUsed: true,
    };
  }
}