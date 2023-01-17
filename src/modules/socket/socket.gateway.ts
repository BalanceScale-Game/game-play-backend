import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SocketService } from './socket.service';
import { GamePlayService } from '../game-play/gamePlay.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  public gamePlayService: GamePlayService;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.gamePlayService = new GamePlayService(server);
  }

  async handleConnection(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication } = parse(cookie);

    const user = await this.socketService.getUserByAuthToken(Authentication);

    this.gamePlayService.connection(socket, user.userId);
  }

  @SubscribeMessage('start_game')
  startGame(@ConnectedSocket() client: Socket) {
    this.gamePlayService.startGame(client);
  }

  @SubscribeMessage('create_room')
  async createRoom(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.gamePlayService.getUserId(client);

      const room: any = await this.socketService.createGameRoom(userId);
      console.log({ room });

      this.gamePlayService.initGameRoom(client, room?._id, userId);
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @SubscribeMessage('join_room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    try {
      this.gamePlayService.joinRoom(client, roomId);
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
