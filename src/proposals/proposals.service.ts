import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(createProposalDto: CreateProposalDto, coordinatorId: string) {
    const enquiry = await this.prisma.enquiry.findUniqueOrThrow({
      where: { id: createProposalDto.enquiryId },
    });
    return this.prisma.proposal.create({
      data: {
      ...createProposalDto,
      clientId: enquiry.clientId,
      coordinatorId,
      status: 'PENDING',
    },
      include: {
        enquiry: true,
        client: true,
        coordinator: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.proposal.findMany({
        where: { clientId: user.id },
        include: { enquiry: true, client: true, coordinator: true },
      });
    } else if (user.role === UserRole.COORDINATOR) {
      return this.prisma.proposal.findMany({
        include: { enquiry: true, client: true, coordinator: true },
      });
    }
    return this.prisma.proposal.findMany({
      include: { enquiry: true, client: true, coordinator: true },
    });
  }

  async findOne(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { enquiry: true, client: true, coordinator: true, contracts: true },
    });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return proposal;
  }

  async update(id: string, updateProposalDto: UpdateProposalDto) {
    return this.prisma.proposal.update({
      where: { id },
      data: updateProposalDto,
      include: { enquiry: true, client: true, coordinator: true },
    });
  }

  async acceptProposal(id: string, clientId: string) {
    return this.prisma.proposal.update({
      where: { id, clientId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
      include: { enquiry: true, client: true, coordinator: true },
    });
  }

  async rejectProposal(id: string, clientId: string) {
    return this.prisma.proposal.update({
      where: { id, clientId },
      data: { status: 'REJECTED' },
      include: { enquiry: true, client: true, coordinator: true },
    });
  }

  async sendProposal(id: string) {
    return this.prisma.proposal.update({
      where: { id },
      data: { sentAt: new Date() },
      include: { enquiry: true, client: true, coordinator: true },
    });
  }

  async remove(id: string) {
    return this.prisma.proposal.delete({
      where: { id },
    });
  }
}