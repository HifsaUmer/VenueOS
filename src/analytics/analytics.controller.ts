import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.FINANCE)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get dashboard stats' })
  @ApiOperation({ summary: 'Get dashboard stats' })
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('revenue-by-space')
  @Roles(UserRole.ADMIN, UserRole.FINANCE)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get revenue by space' })
  @ApiOperation({ summary: 'Get revenue by space' })
  getRevenueBySpace() {
    return this.analyticsService.getRevenueBySpace();
  }

  @Get('event-types')
  @Roles(UserRole.ADMIN, UserRole.FINANCE)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get event types breakdown' })
  @ApiOperation({ summary: 'Get event types breakdown' })
  getEventTypesBreakdown() {
    return this.analyticsService.getEventTypesBreakdown();
  }
}
