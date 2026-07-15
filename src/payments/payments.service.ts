import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User, UserRole, InvoiceStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, clientId: string) {
    const invoice = await this.prisma.invoice.findUniqueOrThrow({
      where: { id: createPaymentDto.invoiceId },
    });

    const totalPaid = await this.prisma.payment.aggregate({
      where: { invoiceId: invoice.id },
      _sum: { amount: true },
    });

    const newTotalPaid = (totalPaid._sum.amount || 0) + createPaymentDto.amount;
    let newStatus = invoice.status;
    if (newTotalPaid >= invoice.amount) {
      newStatus = InvoiceStatus.FULLY_PAID;
    } else if (newTotalPaid > 0) {
      newStatus = InvoiceStatus.DEPOSIT_PAID;
    }

    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: newStatus },
    });

    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        clientId: invoice.clientId,
        paidAt: new Date(),
      },
      include: {
        invoice: true,
        client: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.payment.findMany({
        where: { clientId: user.id },
        include: { invoice: true, client: true },
      });
    }
    return this.prisma.payment.findMany({
      include: { invoice: true, client: true },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { invoice: true, client: true },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: { invoice: true, client: true },
    });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
