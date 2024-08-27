import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly JwtService: JwtService
  ) {}
  
  async handleConnection(client: Socket, ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.JwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log('Cliente conectdo: ', client.id);
    
   
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente
    /*client.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no message!!'
    });*/

    //! Emitir a todos MENOS al cliente incial
    /*client.broadcast.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no message!!'
    });*/


    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message!!'
    });

  }
}
