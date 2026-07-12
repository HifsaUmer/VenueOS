import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private notificationsGateway: NotificationsGateway) {}

  async notifyUser(userId: string, message: string, data?: any) {
    return this.notificationsGateway.sendNotification(userId, {
      message,
      data,
      type: 'USER_NOTIFICATION',
    });
  }

  async notifyBookingCreated(booking: any) {
    // Notify coordinator
    this.notificationsGateway.sendNotification(booking.coordinatorId, {
      message: `New booking created for ${booking.event?.title}`,
      data: booking,
      type: 'BOOKING_CREATED',
    });

    // Notify client
    this.notificationsGateway.sendNotification(booking.clientId, {
      message: `Your booking has been created`,
      data: booking,
      type: 'BOOKING_CREATED',
    });
  }

  async notifyBookingUpdated(booking: any) {
    this.notificationsGateway.broadcastToAll('booking_updated', {
      bookingId: booking.id,
      message: `Booking ${booking.id} has been updated`,
    });
  }

  async notifyConflict(conflict: any) {
    this.notificationsGateway.broadcastToAll('conflict_detected', {
      conflict,
      message: 'Booking conflict detected!',
    });
  }
}