import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}
  
  handleConnection(client: Socket, ) {
    // console.log('Cliente conectdo: ', client.id);
    this.messagesWsService.registerClient(client);
   
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    client.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no message!!'
    });
  }
}
