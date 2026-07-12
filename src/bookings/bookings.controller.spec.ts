import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ConflictDetectionService } from './conflict-detection.service';
import { PrismaService } from '../prisma/prisma.service';
<<<<<<< HEAD
=======
import { SpacesService } from '../spaces/spaces.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VendorsService } from '../vendors/vendors.service';
>>>>>>> main

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        BookingsService,
<<<<<<< HEAD
        ConflictDetectionService,
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
=======
        { provide: PrismaService, useValue: { booking: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } } },
        { provide: SpacesService, useValue: { findOne: jest.fn() } },
        { provide: EquipmentService, useValue: { findOne: jest.fn() } },
        { provide: VendorsService, useValue: { findOne: jest.fn() } },
        { provide: ConflictDetectionService, useValue: { validateBooking: jest.fn() } },
>>>>>>> main
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
<<<<<<< HEAD

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll()).toBe(result);
    });
  });
=======
>>>>>>> main
});