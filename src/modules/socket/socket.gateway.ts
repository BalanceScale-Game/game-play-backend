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
import {
  HttpException,
  HttpStatus,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketService } from './socket.service';
import { GamePlayService } from '../game-play/gamePlay.service';
import { WsExceptionFilter } from 'src/configs/decorators/catchWsError';
import { RoomManagerService } from '../game-play/roomManager.service';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';
import { PlayGameMessageDto, StartGameMessageDto } from './dto';

@UseFilters(WsExceptionFilter)
@UseFilters(AllExceptionsFilter)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly gamePlayService: GamePlayService,
    private readonly roomManagerService: RoomManagerService,
  ) {}

  afterInit(server: any) {
    this.roomManagerService.initRoomManager(server);
  }

  async handleConnection(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication } = parse(cookie);

    const user = await this.socketService.getUserByAuthToken(Authentication);

    this.roomManagerService.connection(socket, user.userId);
  }

  @SubscribeMessage('create_room')
  async createRoom(@ConnectedSocket() client: Socket) {
    try {
      this.roomManagerService.createGameRoom(client);
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
      this.roomManagerService.joinRoom(client, roomId);
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @SubscribeMessage('start_game')
  startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: StartGameMessageDto,
  ) {
    const { roomId } = message;

    this.roomManagerService.startGame(client, roomId);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('choose_number')
  async playGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: PlayGameMessageDto,
  ) {
    try {
      console.log({ message });
      const { type, roomId, chosenNumber } = message;
      this.roomManagerService.chooseNumber(client, roomId, chosenNumber);
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
