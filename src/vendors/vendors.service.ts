import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(createVendorDto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: {
        name: createVendorDto.name,
        category: createVendorDto.category,
        email: createVendorDto.email,
        phone: createVendorDto.phone,
        address: createVendorDto.address,
        description: createVendorDto.description,
        rating: createVendorDto.rating || 0,
      },
    });
  }

  async findAll() {
    return this.prisma.vendor.findMany({
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    await this.findOne(id);
    return this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vendor.delete({
      where: { id },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.vendor.findMany({
      where: { category },
      orderBy: { rating: 'desc' },
    });
  }

  async getTopRated(limit: number = 5) {
    return this.prisma.vendor.findMany({
      orderBy: { rating: 'desc' },
      take: limit,
    });
  }

  async rateVendor(id: string, rating: number) {
    await this.findOne(id);
    return this.prisma.vendor.update({
      where: { id },
      data: { rating },
    });
  }
}