import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User, UserRole, InvoiceStatus } from '@prisma/client';

// Zero configuration, highly compatible PDF generator
const PDFDocument = require('pdfkit');

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id: createInvoiceDto.eventId },
    });
    return this.prisma.invoice.create({
      data: {
        ...createInvoiceDto,
        clientId: event.clientId,
        dueDate: new Date(createInvoiceDto.dueDate),
        status: InvoiceStatus.UNPAID,
      },
      include: {
        event: true,
        client: true,
        payments: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.CLIENT) {
      return this.prisma.invoice.findMany({
        where: { clientId: user.id },
        include: { event: true, client: true, payments: true },
      });
    }
    return this.prisma.invoice.findMany({
      include: { event: true, client: true, payments: true },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { event: true, client: true, payments: true },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const data: any = { ...updateInvoiceDto };
    if (updateInvoiceDto.dueDate) {
      data.dueDate = new Date(updateInvoiceDto.dueDate);
    }
    return this.prisma.invoice.update({
      where: { id },
      data,
      include: { event: true, client: true, payments: true },
    });
  }

  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await this.findOne(id);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // --- PDF Header ---
      doc.fillColor('#1e293b').fontSize(24).text('INVOICE', { align: 'right' });
      doc.moveDown(1);

      // --- Metadata Table/Rows ---
      doc.fontSize(10).fillColor('#64748b');
      doc.text(`Invoice Number: `, { continued: true }).fillColor('#0f172a').text(invoice.number || id);
      doc.fillColor('#64748b').text(`Issue Date: `, { continued: true }).fillColor('#0f172a').text(new Date(invoice.createdAt).toLocaleDateString());
      doc.fillColor('#64748b').text(`Due Date: `, { continued: true }).fillColor('#0f172a').text(new Date(invoice.dueDate).toLocaleDateString());
      doc.moveDown(1.5);

      // Divider Line
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1.5);

      // --- Client Info ---
      doc.fontSize(12).fillColor('#0f172a').text('BILLED TO:', { underline: true });
      doc.fontSize(10).fillColor('#334155').text(`Name: ${invoice.client.fullName}`);
      doc.text(`Email: ${invoice.client.email}`);
      doc.moveDown(2);

      // --- Invoice Items Header ---
      const tableTop = doc.y;
      doc.fillColor('#0f172a').fontSize(10);
      doc.text('Description', 50, tableTop);
      doc.text('Amount', 450, tableTop, { align: 'right' });
      
      // Divider Line
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.moveDown(1);

      // --- Item ---
      const itemY = doc.y + 5;
      doc.fillColor('#475569').text(`Event Concept Blueprint Setup: ${invoice.event.title}`, 50, itemY);
      doc.text(`$${invoice.amount.toFixed(2)}`, 450, itemY, { align: 'right' });
      doc.moveDown(2);

      // Footer space boundary
      const summaryY = doc.y + 15;
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, summaryY).lineTo(550, summaryY).stroke();

      // --- Total & Status ---
      doc.fillColor('#0f172a').fontSize(12).text(`Total Amount Due: $${invoice.amount.toFixed(2)}`, 50, summaryY + 15, { align: 'right' });
      doc.fontSize(10).fillColor('#475569').text(`Payment Status: ${invoice.status}`, 50, summaryY + 35, { align: 'right' });

      doc.end();
    });
  }

  async updateStatus(id: string, status: InvoiceStatus) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
      include: { event: true, client: true, payments: true },
    });
  }

  async remove(id: string) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}