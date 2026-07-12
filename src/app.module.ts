import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { SpacesModule } from './spaces/spaces.module';
import { EquipmentModule } from './equipment/equipment.module';
import { VendorsModule } from './vendors/vendors.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AiModule,
    SpacesModule,      // Add this
    EquipmentModule,   // Add this
    VendorsModule,     // Add this
    BookingsModule,    // Add this
  ],
})
export class AppModule {}