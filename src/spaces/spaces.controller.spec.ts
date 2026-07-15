import { Test, TestingModule } from '@nestjs/testing';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SpacesController', () => {
  let controller: SpacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        SpacesService,
        { provide: PrismaService, useValue: { space: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } } },
      ],
    }).compile();

    controller = module.get<SpacesController>(SpacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});