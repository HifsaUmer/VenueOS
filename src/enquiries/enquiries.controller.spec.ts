import { Test, TestingModule } from '@nestjs/testing';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EnquiriesController', () => {
  let controller: EnquiriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnquiriesController],
      providers: [
        EnquiriesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<EnquiriesController>(EnquiriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});