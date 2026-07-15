import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@ApiTags('Spaces')
@Controller('spaces')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiOperation({ summary: 'Create a new space' })
  @ApiResponse({ status: 201, description: 'Space created successfully' })
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all spaces' })
  @ApiResponse({ status: 200, description: 'List of all spaces' })
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a space by ID' })
  @ApiResponse({ status: 200, description: 'Space found' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Get(':id/availability')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Check space availability' })
  @ApiResponse({ status: 200, description: 'Availability status' })
  checkAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.spacesService.checkAvailability(id, date, startTime, endTime);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiOperation({ summary: 'Update a space' })
  @ApiResponse({ status: 200, description: 'Space updated successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a space' })
  @ApiResponse({ status: 200, description: 'Space deleted successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}