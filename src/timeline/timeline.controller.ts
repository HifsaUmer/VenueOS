import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('timeline')
@Controller('timeline')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  @Roles(UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Timeline item created successfully' })
  @ApiOperation({ summary: 'Create a new timeline item' })
  create(@Body() createTimelineDto: CreateTimelineDto) {
    return this.timelineService.create(createTimelineDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.OPERATIONS) 
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all timeline items' })
  @ApiOperation({ summary: 'Get all timeline items' })
  findAll(@CurrentUser() user: User) {
    return this.timelineService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get timeline item by id' })
  @ApiOperation({ summary: 'Get timeline item by id' })
  findOne(@Param('id') id: string) {
    return this.timelineService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update timeline item' })
  @ApiOperation({ summary: 'Update timeline item' })
  update(
    @Param('id') id: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
  ) {
    return this.timelineService.update(id, updateTimelineDto);
  }

  @Patch(':id/complete')
  @Roles(UserRole.OPERATIONS, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Mark timeline item as complete' })
  @ApiOperation({ summary: 'Mark timeline item as complete' })
  markComplete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.timelineService.markComplete(id, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete timeline item' })
  @ApiOperation({ summary: 'Delete timeline item' })
  remove(@Param('id') id: string) {
    return this.timelineService.remove(id);
  }
}
