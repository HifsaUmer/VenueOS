import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ConflictDetectionService } from './conflict-detection.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VendorsService } from '../vendors/vendors.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({}),
              update: jest.fn().mockResolvedValue({}),
              delete: jest.fn().mockResolvedValue({}),
            },
          },
        },
        {
          provide: SpacesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
            checkAvailability: jest.fn().mockResolvedValue({ isAvailable: true }),
          },
        },
        {
          provide: EquipmentService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
            checkAvailability: jest.fn().mockResolvedValue({ isAvailable: true }),
          },
        },
        {
          provide: VendorsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ConflictDetectionService,
          useValue: {
            validateBooking: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});