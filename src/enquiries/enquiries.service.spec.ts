import { Test, TestingModule } from '@nestjs/testing';
import { EnquiriesService } from './enquiries.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EnquiriesService', () => {
  let service: EnquiriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnquiriesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<EnquiriesService>(EnquiriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});