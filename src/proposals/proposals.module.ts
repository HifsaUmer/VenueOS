import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}