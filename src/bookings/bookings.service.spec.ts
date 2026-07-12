import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ConflictDetectionService } from './conflict-detection.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VendorsService } from '../vendors/vendors.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: { booking: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } } },
        { provide: SpacesService, useValue: { findOne: jest.fn() } },
        { provide: EquipmentService, useValue: { findOne: jest.fn() } },
        { provide: VendorsService, useValue: { findOne: jest.fn() } },
        { provide: ConflictDetectionService, useValue: { validateBooking: jest.fn() } },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ConflictDetectionService } from './conflict-detection.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VendorsService } from '../vendors/vendors.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: { booking: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } } },
        { provide: SpacesService, useValue: { findOne: jest.fn() } },
        { provide: EquipmentService, useValue: { findOne: jest.fn() } },
        { provide: VendorsService, useValue: { findOne: jest.fn() } },
        { provide: ConflictDetectionService, useValue: { validateBooking: jest.fn() } },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});