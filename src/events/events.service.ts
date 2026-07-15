import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User, UserRole, EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, clientId: string) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        clientId,
        status: EventStatus.DRAFT,
      },
      include: {
        contract: true,
        client: true,
        bookings: true,
        timelines: true,
        invoices: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.event.findMany({
        where: { clientId: user.id },
        include: {
          contract: true,
          client: true,
          bookings: true,
          timelines: true,
          invoices: true,
        },
      });
    }
    return this.prisma.event.findMany({
      include: {
        contract: true,
        client: true,
        bookings: true,
        timelines: true,
        invoices: true,
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        contract: true,
        client: true,
        bookings: { include: { space: true, bookingEquipment: true, bookingVendors: true } },
        timelines: { include: { assignee: true } },
        invoices: { include: { payments: true } },
      },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
      include: {
        contract: true,
        client: true,
        bookings: true,
        timelines: true,
        invoices: true,
      },
    });
  }

  async updateStatus(id: string, status: EventStatus) {
    return this.prisma.event.update({
      where: { id },
      data: { status },
      include: {
        contract: true,
        client: true,
        bookings: true,
        timelines: true,
        invoices: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
