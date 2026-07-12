import { ApiProperty } from '@nestjs/swagger';

export class AiResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data?: any;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  error?: string;

  @ApiProperty({ required: false })
  fallbackUsed?: boolean;
}