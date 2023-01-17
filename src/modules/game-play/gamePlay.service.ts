import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Room } from './room.service';
import { Player } from './player.service';

@Injectable()
export class GamePlayService {
  public server: Server;
  public rooms: Room[] = [];
  public players: Player[] = [];
  public clientMap = new Map();

  constructor(server: Server) {
    this.server = server;
  }
  initGameRoom = (client: Socket, roomId: string, roomMasterId: string) => {
    client.join(roomId);

    const newPlayer = new Player(roomMasterId);
    const newRoom = new Room(this.server, roomId, newPlayer);

    this.rooms.push(newRoom);
    this.players.push(newPlayer);
  };

  connection(socket: Socket, userId: string) {
    this.clientMap.set(socket.id, userId);
  }

  getUserId(client: Socket) {
    const userId = this.clientMap.get(client.id);
    return userId;
  }

  joinRoom(client: Socket, roomId: string) {
    const userId = this.clientMap.get(client.id);

    if (userId) client.join(roomId);

    const room = this.rooms.filter((item) => item.getRoomId() === roomId)?.[0];
    const newPlayer = new Player(userId);
    this.players.push(newPlayer);
    room.addPlayer(newPlayer);
  }

  startGame(client: Socket) {
    const clientId = this.clientMap.get(client.id);

    const room = this.rooms.filter(
      (item) => item.getRoomMaster().getId() === clientId,
    )?.[0];

    room.startGame();
  }
}
