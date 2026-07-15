<<<<<<< Updated upstream
import { Injectable } from '@nestjs/common';
=======
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, InvoiceStatus } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
>>>>>>> Stashed changes

@Injectable()
export class InvoicesService {}
