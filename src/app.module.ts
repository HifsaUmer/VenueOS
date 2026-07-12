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
import { NotificationsModule } from './notifications/notifications.module';
import { CalendarModule } from './calendar/calendar.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { EventsModule } from './events/events.module';
import { TimelineModule } from './timeline/timeline.module';
import { ClientsModule } from './clients/clients.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AiModule,
    SpacesModule,
    EquipmentModule,
    VendorsModule,
    BookingsModule,
    NotificationsModule,
    CalendarModule,
    InvoicesModule,
    PaymentsModule,
    AnalyticsModule,
    EventsModule,
    TimelineModule,
    ClientsModule,
    EnquiriesModule,
    ProposalsModule,
    ContractsModule,
  ],
})
export class AppModule {}