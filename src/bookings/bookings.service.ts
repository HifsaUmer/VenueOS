import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VendorsService } from '../vendors/vendors.service';
import { CreateBookingDto, BookingStatus } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private spacesService: SpacesService,
    private equipmentService: EquipmentService,
    private vendorsService: VendorsService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const {
      eventId,
      spaceId,
      date,
      startTime,
      endTime,
      guestCount,
      equipmentIds,
      equipmentQuantities,
      vendorIds,
      status,
      notes,
    } = createBookingDto;

    // 1. Check space exists
    await this.spacesService.findOne(spaceId);

    // 2. Check for space conflicts
    const spaceConflict = await this.spacesService.checkAvailability(
      spaceId,
      date,
      startTime,
      endTime,
    );

    if (!spaceConflict.isAvailable) {
      throw new ConflictException({
        message: 'Space is not available at the requested time',
        conflicts: spaceConflict.conflictingBookings,
      });
    }

    // 3. Check equipment availability
    if (equipmentIds && equipmentIds.length > 0) {
      for (let i = 0; i < equipmentIds.length; i++) {
        const equipId = equipmentIds[i];
        const quantity = equipmentQuantities?.[i] || 1;
        const availability = await this.equipmentService.checkAvailability(
          equipId,
          quantity,
          date,
        );
        if (!availability.isAvailable) {
          throw new ConflictException({
            message: `Equipment ${availability.equipmentName} is not available`,
            equipment: availability,
          });
        }
      }
    }

    // 4. Create booking with transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          eventId,
          spaceId,
          userId: '',
          date: new Date(date),
          startTime,
          endTime,
          guestCount,
          status: status || BookingStatus.PENDING,
          notes,
        },
      });

      // Create booking equipment relations
      if (equipmentIds && equipmentIds.length > 0) {
        for (let i = 0; i < equipmentIds.length; i++) {
          await prisma.bookingEquipment.create({
            data: {
              bookingId: booking.id,
              equipmentId: equipmentIds[i],
              quantity: equipmentQuantities?.[i] || 1,
            },
          });
        }
      }

      // Create booking vendor relations
      if (vendorIds && vendorIds.length > 0) {
        for (const vendorId of vendorIds) {
          await prisma.bookingVendor.create({
            data: {
              bookingId: booking.id,
              vendorId,
            },
          });
        }
      }

      return this.findOne(booking.id);
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        space: true,
        event: true,
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        space: true,
        event: true,
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    // If date/time/space changed, check conflicts
    if (
      updateBookingDto.spaceId ||
      updateBookingDto.date ||
      updateBookingDto.startTime ||
      updateBookingDto.endTime
    ) {
      const current = await this.findOne(id);
      const spaceId = updateBookingDto.spaceId || current.spaceId;
      const date = updateBookingDto.date || current.date;
      const startTime = updateBookingDto.startTime || current.startTime;
      const endTime = updateBookingDto.endTime || current.endTime;

      // Fix: Convert date to string if it's a Date object
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

      const conflict = await this.spacesService.checkAvailability(
        spaceId,
        dateStr,
        startTime,
        endTime,
      );

      if (!conflict.isAvailable) {
        const filteredConflicts = conflict.conflictingBookings.filter(
          (b) => b.id !== id,
        );
        if (filteredConflicts.length > 0) {
          throw new ConflictException({
            message: 'Space is not available at the requested time',
            conflicts: filteredConflicts,
          });
        }
      }
    }

    // Update booking
    const { equipmentIds, equipmentQuantities, vendorIds, ...updateData } =
      updateBookingDto;

    return this.prisma.$transaction(async (prisma) => {
      // Update main booking
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          ...updateData,
          date: updateData.date ? new Date(updateData.date) : undefined,
        },
      });

      // Update equipment if provided
      if (equipmentIds) {
        await prisma.bookingEquipment.deleteMany({
          where: { bookingId: id },
        });

        for (let i = 0; i < equipmentIds.length; i++) {
          await prisma.bookingEquipment.create({
            data: {
              bookingId: id,
              equipmentId: equipmentIds[i],
              quantity: equipmentQuantities?.[i] || 1,
            },
          });
        }
      }

      // Update vendors if provided
      if (vendorIds) {
        await prisma.bookingVendor.deleteMany({
          where: { bookingId: id },
        });

        for (const vendorId of vendorIds) {
          await prisma.bookingVendor.create({
            data: {
              bookingId: id,
              vendorId,
            },
          });
        }
      }

      return this.findOne(id);
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.$transaction(async (prisma) => {
      // Delete relations first
      await prisma.bookingEquipment.deleteMany({
        where: { bookingId: id },
      });
      await prisma.bookingVendor.deleteMany({
        where: { bookingId: id },
      });

      // Delete booking
      return prisma.booking.delete({
        where: { id },
      });
    });
  }

  async getByDate(date: string) {
    return this.prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: 'CANCELLED' },
      },
      include: {
        space: true,
        event: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getByEvent(eventId: string) {
    return this.prisma.booking.findMany({
      where: { eventId },
      include: {
        space: true,
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async getCalendarData(startDate: string, endDate: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        status: { not: 'CANCELLED' },
      },
      include: {
        space: true,
        event: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    // Group by space
    const spaces = await this.prisma.space.findMany();
    const calendarData = spaces.map((space) => {
      const spaceBookings = bookings.filter((b) => b.spaceId === space.id);
      return {
        space,
        bookings: spaceBookings,
      };
    });

    return calendarData;
  }
}