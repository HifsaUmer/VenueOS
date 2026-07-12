import { IsString, IsOptional, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AiFeature {
  EVENT_BRIEF_INTERPRETER = 'event_brief_interpreter',
  CONTRACT_CLAUSE_ASSISTANT = 'contract_clause_assistant',
  POST_EVENT_DEBRIEF = 'post_event_debrief',
}

export class AiRequestDto {
  @ApiProperty({ enum: AiFeature })
  @IsEnum(AiFeature)
  @IsNotEmpty()
  feature: AiFeature;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}