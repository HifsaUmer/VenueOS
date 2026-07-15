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
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiOperation({ summary: 'Create a new vendor' })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all vendors' })
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get('top-rated')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get top rated vendors' })
  getTopRated(@Query('limit') limit?: string) {
    return this.vendorsService.getTopRated(limit ? parseInt(limit) : 5);
  }

  @Get('category/:category')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get vendors by category' })
  findByCategory(@Param('category') category: string) {
    return this.vendorsService.findByCategory(category);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get vendor by ID' })
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiOperation({ summary: 'Update vendor' })
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Patch(':id/rate')
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiOperation({ summary: 'Rate a vendor' })
  rateVendor(@Param('id') id: string, @Body('rating') rating: number) {
    return this.vendorsService.rateVendor(id, rating);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete vendor' })
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}