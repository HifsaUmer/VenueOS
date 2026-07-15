import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: {
        name: createSpaceDto.name,
        type: createSpaceDto.type,
        capacity: createSpaceDto.capacity,
        hourlyRate: createSpaceDto.hourlyRate,
        description: createSpaceDto.description,
        amenities: createSpaceDto.amenities,
        isAvailable: createSpaceDto.isAvailable ?? true,
        requiresDeposit: createSpaceDto.requiresDeposit ?? false,
      },
    });
  }

  async findAll() {
    return this.prisma.space.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const space = await this.prisma.space.findUnique({
      where: { id },
    });

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.space.update({
      where: { id },
      data: updateSpaceDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.space.delete({
      where: { id },
    });
  }

  async checkAvailability(id: string, date: string, startTime: string, endTime: string) {
    const space = await this.findOne(id);

    // Check for overlapping bookings
    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        spaceId: id,
        date: new Date(date),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
        status: { not: 'CANCELLED' },
      },
    });

    return {
      spaceId: id,
      spaceName: space.name,
      isAvailable: overlappingBookings.length === 0,
      conflictingBookings: overlappingBookings,
    };
  }
}