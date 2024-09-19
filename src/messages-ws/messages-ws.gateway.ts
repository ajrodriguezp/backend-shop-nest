import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {
  }

  async handleConnection(client: Socket,) {
    // console.log('Client connected: ' + client.id);
    const token = client.handshake.headers.auth as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected: ' + client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('messageClient')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Comunicacion solamente al cliente que envio el mensaje
    // client.emit('messageServer', {
    //   fullName: 'Server',
    //   message: payload.message || 'no message',
    // });

    //! Emite a todos los clientes menos al que envio el mensaje
    // client.broadcast.emit('messageServer', {
    //   fullName: 'Server',
    //   message: payload.message || 'no message',
    // });

    //! Emite a todos los clientes
    this.wss.emit('messageServer', {
      fullName: this.messagesWsService.getUserFullNmae(client.id),
      message: payload.message || 'no message',
    });
  }


}
