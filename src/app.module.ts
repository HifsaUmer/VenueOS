import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { VendorsModule } from './vendors/vendors.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TimelineModule } from './timeline/timeline.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ClientsModule } from './clients/clients.module';
import { SpacesModule } from './spaces/spaces.module';
import { EquipmentModule } from './equipment/equipment.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, AiModule, EventsModule, BookingsModule, VendorsModule, PaymentsModule, NotificationsModule, TimelineModule, InvoicesModule, AnalyticsModule, ClientsModule, SpacesModule, EquipmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
