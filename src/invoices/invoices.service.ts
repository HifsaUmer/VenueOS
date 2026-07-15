import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User, UserRole, InvoiceStatus } from '@prisma/client';
// import * as pdfmake from 'pdfmake';
// import * as path from 'path';

// const fonts = {
//   Roboto: {
//     normal: path.join(__dirname, '../../../node_modules/roboto-font/fonts/Roboto/Roboto-Regular.ttf'),
//     bold: path.join(__dirname, '../../../node_modules/roboto-font/fonts/Roboto/Roboto-Bold.ttf'),
//     italics: path.join(__dirname, '../../../node_modules/roboto-font/fonts/Roboto/Roboto-Italic.ttf'),
//     bolditalics: path.join(__dirname, '../../../node_modules/roboto-font/fonts/Roboto/Roboto-BoldItalic.ttf')
//   }
// };


// const PdfPrinter = pdfmake.default ? pdfmake.default : pdfmake;
// const printer = new PdfPrinter(fonts);

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
    throw new Error('PDF generation is temporarily disabled for debugging');
    // const invoice = await this.findOne(id);
    // const docDefinition = {
    //   content: [
    //     { text: 'INVOICE', style: 'header' },
    //     { text: `Invoice Number: ${invoice.number}`, style: 'subheader' },
    //     { text: `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, style: 'subheader' },
    //     { text: `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, style: 'subheader' },
    //     '\n',
    //     {
    //       columns: [
    //         {
    //           width: '*',
    //           text: `Client: ${invoice.client.fullName}\nEmail: ${invoice.client.email}`
    //         }
    //       ]
    //     },
    //     '\n',
    //     {
    //       table: {
    //         headerRows: 1,
    //         widths: ['*', 'auto'],
    //         body: [
    //           ['Description', 'Amount'],
    //           [`Event: ${invoice.event.title}`, `$${invoice.amount.toFixed(2)}`],
    //         ]
    //       }
    //     },
    //     '\n',
    //     { text: `Total Amount: $${invoice.amount.toFixed(2)}`, style: 'total' },
    //     '\n',
    //     { text: `Status: ${invoice.status}`, style: 'status' }
    //   ],
    //   styles: {
    //     header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
    //     subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
    //     total: { fontSize: 16, bold: true, margin: [0, 10, 0, 10] },
    //     status: { fontSize: 14, margin: [0, 5, 0, 5] }
    //   }
    // };

    // return new Promise((resolve, reject) => {
    //   const chunks: any[] = [];
    //   const pdfDoc = printer.createPdfKitDocument(docDefinition);
    //   pdfDoc.on('data', chunk => chunks.push(chunk));
    //   pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    //   pdfDoc.on('error', reject);
    //   pdfDoc.end();
    // });
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
