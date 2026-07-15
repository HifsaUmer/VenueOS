import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

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
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const spaces = await this.prisma.space.findMany();
    const calendarData = spaces.map((space) => {
      const spaceBookings = bookings.filter((b) => b.spaceId === space.id);
      return {
        space,
        bookings: spaceBookings,
        totalBookings: spaceBookings.length,
      };
    });

    return {
      startDate,
      endDate,
      spaces: calendarData,
      totalBookings: bookings.length,
    };
  }

  async getSpaceCalendar(spaceId: string, startDate: string, endDate: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        spaceId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        status: { not: 'CANCELLED' },
      },
      include: {
        event: true,
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
    });

    return {
      space,
      bookings,
      totalBookings: bookings.length,
    };
  }

  async getConflicts(startDate: string, endDate: string) {
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
        bookingEquipment: {
          include: { equipment: true },
        },
        bookingVendors: {
          include: { vendor: true },
        },
      },
    });

    const conflicts: any = {
      spaceConflicts: [],
      equipmentConflicts: [],
      vendorConflicts: [],
    };

    // Space conflicts
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const b1 = bookings[i];
        const b2 = bookings[j];

        // Format Date objects to clean YYYY-MM-DD strings to avoid comparison bugs
        const b1DateStr = b1.date.toISOString().split('T')[0];
        const b2DateStr = b2.date.toISOString().split('T')[0];

        if (
          b1.spaceId === b2.spaceId &&
          b1DateStr === b2DateStr &&
          this.hasTimeOverlap(b1.startTime, b1.endTime, b2.startTime, b2.endTime)
        ) {
          conflicts.spaceConflicts.push({
            booking1: {
              id: b1.id,
              title: b1.event?.title || 'Event',
              startTime: b1.startTime,
              endTime: b1.endTime,
            },
            booking2: {
              id: b2.id,
              title: b2.event?.title || 'Event',
              startTime: b2.startTime,
              endTime: b2.endTime,
            },
            space: b1.space,
          });
        }
      }
    }

    // Equipment conflicts
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const b1 = bookings[i];
        const b2 = bookings[j];

        const b1DateStr = b1.date.toISOString().split('T')[0];
        const b2DateStr = b2.date.toISOString().split('T')[0];

        if (
          b1DateStr === b2DateStr &&
          this.hasTimeOverlap(b1.startTime, b1.endTime, b2.startTime, b2.endTime)
        ) {
          const equip1 = b1.bookingEquipment.map((be) => be.equipmentId);
          const equip2 = b2.bookingEquipment.map((be) => be.equipmentId);
          const commonEquip = equip1.filter((id) => equip2.includes(id));

          if (commonEquip.length > 0) {
            const equipment = await this.prisma.equipment.findMany({
              where: { id: { in: commonEquip } },
            });
            conflicts.equipmentConflicts.push({
              booking1: {
                id: b1.id,
                title: b1.event?.title || 'Event',
              },
              booking2: {
                id: b2.id,
                title: b2.event?.title || 'Event',
              },
              equipment: equipment,
            });
          }
        }
      }
    }

    // Vendor conflicts
    const vendorMap = new Map();
    for (const booking of bookings) {
      for (const bv of booking.bookingVendors) {
        const key = `${bv.vendorId}-${booking.date.toISOString().split('T')[0]}`;
        if (!vendorMap.has(key)) {
          vendorMap.set(key, []);
        }
        vendorMap.get(key).push(booking);
      }
    }

    for (const [key, vendorBookings] of vendorMap) {
      if (vendorBookings.length > 1) {
        const [vendorId] = key.split('-');
        const vendor = await this.prisma.vendor.findUnique({
          where: { id: vendorId },
        });
        conflicts.vendorConflicts.push({
          vendor: vendor,
          bookings: vendorBookings.map((b: any) => ({
            id: b.id,
            title: b.event?.title || 'Event',
            startTime: b.startTime,
            endTime: b.endTime,
          })),
        });
      }
    }

    return {
      startDate,
      endDate,
      conflicts,
      totalConflicts:
        conflicts.spaceConflicts.length +
        conflicts.equipmentConflicts.length +
        conflicts.vendorConflicts.length,
    };
  }

  async getCalendarEvents(startDate: string, endDate: string) {
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

    return bookings.map((booking) => ({
      id: booking.id,
      title: booking.event?.title || 'Event',
      start: `${booking.date.toISOString().split('T')[0]}T${booking.startTime}`,
      end: `${booking.date.toISOString().split('T')[0]}T${booking.endTime}`,
      space: booking.space?.name,
      status: booking.status,
      extendedProps: {
        spaceId: booking.spaceId,
        guestCount: booking.guestCount,
        status: booking.status,
      },
    }));
  }

  private hasTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    return (
      (start1 <= start2 && end1 > start2) ||
      (start1 < end2 && end1 >= end2) ||
      (start1 >= start2 && end1 <= end2) ||
      (start1 <= start2 && end1 >= end2)
    );
  }
}