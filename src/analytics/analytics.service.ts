import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalEvents = await this.prisma.event.count();
    const totalBookings = await this.prisma.booking.count();
    const totalRevenue = await this.prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: 'FULLY_PAID' },
    });
    const totalClients = await this.prisma.user.count({
      where: { role: 'CLIENT' },
    });

    return {
      totalEvents,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalClients,
    };
  }

  async getRevenueBySpace() {
    const spaces = await this.prisma.space.findMany({
      include: {
        bookings: {
          include: {
            event: {
              include: { invoices: { where: { status: 'FULLY_PAID' } } },
            },
          },
        },
      },
    });

    return spaces.map(space => {
      const revenue = space.bookings.reduce((acc, booking) => {
        const bookingRevenue = booking.event.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        return acc + bookingRevenue;
      }, 0);
      return { spaceName: space.name, revenue };
    });
  }

  async getEventTypesBreakdown() {
    const events = await this.prisma.event.groupBy({
      by: ['type'],
      _count: { id: true },
    });
    return events.map(e => ({ type: e.type, count: e._count.id }));
  }
}
