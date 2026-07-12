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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('enquiries')
@Controller('enquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Enquiry created successfully' })
  @ApiOperation({ summary: 'Create a new enquiry (Client only)' })
  create(
    @Body() createEnquiryDto: CreateEnquiryDto,
    @CurrentUser() user: User,
  ) {
    return this.enquiriesService.create(createEnquiryDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all enquiries' })
  @ApiOperation({ summary: 'Get all enquiries' })
  findAll(@CurrentUser() user: User) {
    return this.enquiriesService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get enquiry by id' })
  @ApiOperation({ summary: 'Get enquiry by id' })
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update enquiry' })
  @ApiOperation({ summary: 'Update enquiry' })
  update(
    @Param('id') id: string,
    @Body() updateEnquiryDto: UpdateEnquiryDto,
  ) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @Patch(':id/assign-coordinator/:coordinatorId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Assign coordinator to enquiry' })
  @ApiOperation({ summary: 'Assign coordinator to enquiry' })
  assignCoordinator(
    @Param('id') id: string,
    @Param('coordinatorId') coordinatorId: string,
  ) {
    return this.enquiriesService.assignCoordinator(id, coordinatorId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete enquiry' })
  @ApiOperation({ summary: 'Delete enquiry' })
  remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }
}