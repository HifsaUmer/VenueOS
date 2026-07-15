import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto, coordinatorId: string) {
    const proposal = await this.prisma.proposal.findUniqueOrThrow({
      where: { id: createContractDto.proposalId },
    });
    return this.prisma.contract.create({
      data: {
        ...createContractDto,
        clientId: proposal.clientId,
        coordinatorId,
        status: 'DRAFT',
      },
      include: {
        proposal: true,
        client: true,
        coordinator: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.contract.findMany({
        where: { clientId: user.id },
        include: { proposal: true, client: true, coordinator: true },
      });
    } else if (user.role === UserRole.COORDINATOR) {
      return this.prisma.contract.findMany({
        include: { proposal: true, client: true, coordinator: true },
      });
    }
    return this.prisma.contract.findMany({
      include: { proposal: true, client: true, coordinator: true },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { proposal: true, client: true, coordinator: true, events: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    return this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
      include: { proposal: true, client: true, coordinator: true },
    });
  }

  async signContract(id: string, clientId: string) {
    return this.prisma.contract.update({
      where: { id, clientId },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
      },
      include: { proposal: true, client: true, coordinator: true },
    });
  }

  async sendContract(id: string) {
    return this.prisma.contract.update({
      where: { id },
      data: { sentAt: new Date(), status: 'SENT' },
      include: { proposal: true, client: true, coordinator: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contract.delete({
      where: { id },
    });
  }
}