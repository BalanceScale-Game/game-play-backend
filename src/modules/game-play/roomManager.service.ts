import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Room } from './room';
import { Player } from './player';
import { TaskSchedulingService } from '../task-scheduling/taskScheduling.service';
import { GamePlayService } from './gamePlay.service';
import { sleep } from 'src/utils/sleep';

@Injectable()
export class RoomManagerService {
  public rooms: Room[] = [];
  public clientMap = new Map();
  private server: Server;

  constructor(
    protected readonly taskSchedulingService: TaskSchedulingService,
    private readonly gamePlayService: GamePlayService,
  ) {}

  initRoomManager = (server: Server) => {
    this.server = server;
  };

  connection(socket: Socket, userId: string) {
    this.clientMap.set(socket.id, userId);
  }

  getUserId(client: Socket) {
    const userId = this.clientMap.get(client.id);
    return userId;
  }

  async createGameRoom(client: Socket) {
    const userId = this.getUserId(client);

    const room: any = await this.gamePlayService.createGameRoom(userId);
    console.log({ room });

    const newRoom = new Room(room._id, userId);
    this.rooms.push(newRoom);

    client.join(newRoom.getRoomId());
  }

  joinRoom(client: Socket, roomId: string) {
    const userId = this.clientMap.get(client.id);

    if (userId) client.join(roomId);

    const room = this.rooms.filter((item) => item.getRoomId() === roomId)?.[0];
    const newPlayer = new Player(userId);
    room.addPlayer(newPlayer);
  }

  async startGame(client: Socket, roomId: string) {
    const room = this.getRoomById(roomId);
    const userId = this.getUserIdBySocket(client);
    console.log(room, userId);
    if (room.getRoomMaster().getId() !== userId) {
      return;
    }

    this.server.sockets.to(roomId).emit('receive_message', {
      type: 'game_state',
      message: 'game_prepare',
    });

    await sleep(3000);
    this.server.sockets.to(roomId).emit('receive_message', {
      type: 'game_state',
      message: 'game_start',
    });

    this.roundStart(roomId);
  }

  async roundStart(roomId: string) {
    const room = this.getRoomById(roomId);
    while (room.gameState !== 'ended') {
      room.roundStart();

      this.server.sockets.to(roomId).emit('receive_message', {
        type: 'game_state',
        message: 'round_start',
        data: {
          currentRound: room.currentRound,
        },
      });

      await sleep(3000);
      const result = room.calculateGameResult();

      this.server.sockets.to(roomId).emit('receive_message', {
        type: 'game_state',
        message: 'round_end',
        data: result,
      });

      console.log(room.gameState);
    }
  }

  chooseNumber(client: Socket, roomId: string, chosenNumber: number) {
    const clientId = this.clientMap.get(client.id);
    const room = this.getRoomById(roomId);

    if (clientId) room.chooseNumber(clientId, chosenNumber);
  }

  getRoomById(roomId: string): Room {
    const room = this.rooms.filter((room) => room.getRoomId() === roomId)?.[0];

    return room;
  }

  getRoomByRoomMaster(roomMaster: Socket) {
    const clientId = this.clientMap.get(roomMaster.id);
    const room = this.rooms.filter(
      (room) => room.getRoomMaster().getId() === clientId,
    )?.[0];

    return room;
  }

  getUserIdBySocket(client: Socket) {
    const userId = this.clientMap.get(client.id);
    return userId;
  }
}
