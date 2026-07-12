import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiResponseDto } from './dto/ai-response.dto';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('process')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.OPERATIONS, UserRole.FINANCE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process AI request' })
  @ApiResponse({ status: 200, description: 'AI request processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async processRequest(
    @Body() aiRequest: AiRequestDto,
    @Request() req,
  ): Promise<AiResponseDto> {
    console.log(`User ${req.user.email} (${req.user.role}) is using AI feature: ${aiRequest.feature}`);
    return this.aiService.processRequest(aiRequest);
  }
}