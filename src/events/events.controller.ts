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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole, EventStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Event created successfully' })
  @ApiOperation({ summary: 'Create a new event' })
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    // Passes the extracted request user ID directly into the database mapping pipeline context
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all events' })
  @ApiOperation({ summary: 'Get all events' })
  findAll(@CurrentUser() user: User) {
    return this.eventsService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get event by id' })
  @ApiOperation({ summary: 'Get event by id' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update event' })
  @ApiOperation({ summary: 'Update event' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update event status' })
  @ApiOperation({ summary: 'Update event status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
  ) {
    return this.eventsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete event' })
  @ApiOperation({ summary: 'Delete event' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}