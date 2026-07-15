import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SpacesService', () => {
  let service: SpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        { provide: PrismaService, useValue: { space: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } } },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});