import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async create(createTimelineDto: CreateTimelineDto) {
    return this.prisma.timeline.create({
      data: {
        ...createTimelineDto,
        completed: false,
      },
      include: {
        event: true,
        assignee: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.OPERATIONS) {
      return this.prisma.timeline.findMany({
        where: { assignedTo: user.id },
        include: { event: true, assignee: true },
      });
    }
    return this.prisma.timeline.findMany({
      include: { event: true, assignee: true },
    });
  }

  async findOne(id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id },
      include: { event: true, assignee: true },
    });
    if (!timeline) {
      throw new NotFoundException(`Timeline with ID ${id} not found`);
    }
    return timeline;
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto) {
    return this.prisma.timeline.update({
      where: { id },
      data: updateTimelineDto,
      include: { event: true, assignee: true },
    });
  }

  async markComplete(id: string, userId: string) {
    return this.prisma.timeline.update({
      where: { id, OR: [{ assignedTo: userId }] },
      data: { completed: true },
      include: { event: true, assignee: true },
    });
  }

  async remove(id: string) {
    return this.prisma.timeline.delete({
      where: { id },
    });
  }
}
