import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SpacesModule } from '../spaces/spaces.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [PrismaModule, SpacesModule, EquipmentModule, VendorsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}