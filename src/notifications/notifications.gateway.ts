import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private connectedClients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId || client.handshake.query.userId;
    if (userId) {
      this.connectedClients.set(userId, client.id);
      this.logger.log(`Client connected: ${userId} (${client.id})`);
      
      // Send welcome message
      client.emit('connected', { 
        message: 'Connected to notification server',
        userId 
      });
    } else {
      this.logger.warn(`Client connected without userId: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId || client.handshake.query.userId;
    if (userId) {
      this.connectedClients.delete(userId);
      this.logger.log(`Client disconnected: ${userId} (${client.id})`);
    }
  }

  // Send notification to specific user
  sendNotification(userId: string, notification: any) {
    const clientId = this.connectedClients.get(userId);
    if (clientId) {
      this.server.to(clientId).emit('notification', {
        ...notification,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Notification sent to user ${userId}`);
      return true;
    }
    this.logger.warn(`User ${userId} not connected`);
    return false;
  }

  // Broadcast to all connected clients
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcast ${event} to all clients`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, payload: { room: string }) {
    client.join(payload.room);
    this.logger.log(`Client ${client.id} joined room: ${payload.room}`);
    client.emit('joined-room', { room: payload.room });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, payload: { room: string }) {
    client.leave(payload.room);
    this.logger.log(`Client ${client.id} left room: ${payload.room}`);
    client.emit('left-room', { room: payload.room });
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket): void {
    client.emit('pong', { 
      timestamp: new Date().toISOString(),
      clientId: client.id 
    });
  }
}