import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConflictDetectionService {
  constructor(private prisma: PrismaService) {}

  async detectAllConflicts(bookingData: any) {
    const conflicts = {
      space: await this.detectSpaceConflicts(bookingData),
      equipment: await this.detectEquipmentConflicts(bookingData),
      vendor: await this.detectVendorConflicts(bookingData),
      staff: await this.detectStaffConflicts(bookingData),
    };

    const hasConflicts = Object.values(conflicts).some(
      (conflictList) => conflictList.length > 0
    );

    if (hasConflicts) {
      throw new ConflictException({
        message: 'Booking conflicts detected',
        conflicts,
      });
    }

    return { hasConflicts: false, conflicts };
  }

  async detectSpaceConflicts(bookingData: any) {
    const { spaceId, date, startTime, endTime, excludeBookingId } = bookingData;

    const where: any = {
      spaceId,
      date: new Date(date),
      status: { notIn: ['CANCELLED', 'COMPLETED'] },
    };

    if (excludeBookingId) {
      where.id = { not: excludeBookingId };
    }

    return this.prisma.booking.findMany({
      where: {
        ...where,
        OR: [
          // New booking starts during existing booking
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          // New booking ends during existing booking
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          // New booking completely overlaps existing booking
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
          // Existing booking completely overlaps new booking
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
      include: {
        space: true,
        event: true,
      },
    });
  }

  async detectEquipmentConflicts(bookingData: any) {
    const { equipmentIds, date, startTime, endTime, excludeBookingId } = bookingData;

    if (!equipmentIds || equipmentIds.length === 0) {
      return [];
    }

    const where: any = {
      equipmentId: { in: equipmentIds },
      booking: {
        date: new Date(date),
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
    };

    if (excludeBookingId) {
      where.bookingId = { not: excludeBookingId };
    }

    // Find bookings with same equipment on same date
    const conflictingBookings = await this.prisma.bookingEquipment.findMany({
      where,
      include: {
        equipment: true,
        booking: {
          include: {
            space: true,
            event: true,
          },
        },
      },
    });

    // Filter by time overlap
    return conflictingBookings.filter((be) => {
      const b = be.booking;
      return (
        (b.startTime <= startTime && b.endTime > startTime) ||
        (b.startTime < endTime && b.endTime >= endTime) ||
        (b.startTime >= startTime && b.endTime <= endTime) ||
        (b.startTime <= startTime && b.endTime >= endTime)
      );
    });
  }

  async detectVendorConflicts(bookingData: any) {
    const { vendorIds, date, excludeBookingId } = bookingData;

    if (!vendorIds || vendorIds.length === 0) {
      return [];
    }

    const where: any = {
      vendorId: { in: vendorIds },
      booking: {
        date: new Date(date),
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
    };

    if (excludeBookingId) {
      where.bookingId = { not: excludeBookingId };
    }

    return this.prisma.bookingVendor.findMany({
      where,
      include: {
        vendor: true,
        booking: {
          include: {
            space: true,
            event: true,
          },
        },
      },
    });
  }

  async detectStaffConflicts(bookingData: any) {
    // Implementation for staff conflict detection
    // Can be extended based on requirements
    return [];
  }

  async validateBooking(bookingData: any) {
    return this.detectAllConflicts(bookingData);
  }
}