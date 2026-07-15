import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEnquiryDto: CreateEnquiryDto, clientId: string) {
    return this.prisma.enquiry.create({
      data: {
        ...createEnquiryDto,
        clientId,
        status: 'RECEIVED',
      },
      include: {
        client: true,
        coordinator: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.enquiry.findMany({
        where: { clientId: user.id },
        include: { client: true, coordinator: true },
      });
    } else if (user.role === UserRole.COORDINATOR) {
      return this.prisma.enquiry.findMany({
        include: { client: true, coordinator: true },
      });
    }
    return this.prisma.enquiry.findMany({
      include: { client: true, coordinator: true },
    });
  }

  async findOne(id: string) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id },
      include: { client: true, coordinator: true, proposals: true },
    });
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto) {
    return this.prisma.enquiry.update({
      where: { id },
      data: updateEnquiryDto,
      include: { client: true, coordinator: true },
    });
  }

  async assignCoordinator(id: string, coordinatorId: string) {
    return this.prisma.enquiry.update({
      where: { id },
      data: { coordinatorId },
      include: { client: true, coordinator: true },
    });
  }
  async updateStatus(id: string, status: string) {
  const enquiry = await this.prisma.enquiry.findUnique({
    where: { id },
  });
  if (!enquiry) {
    throw new NotFoundException(`Enquiry with ID ${id} not found`);
  }
  return this.prisma.enquiry.update({
    where: { id },
    data: { status },
    include: { client: true, coordinator: true },
  });
}

  async remove(id: string) {
    return this.prisma.enquiry.delete({
      where: { id },
    });
  }
}