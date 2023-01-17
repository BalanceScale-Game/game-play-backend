import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Player } from './player.service';

@Injectable()
export class Room {
  constructor(
    private server: Server,
    private roomId: string,
    private roomMaster: Player,
    private players?: Player[],
  ) {
    this.server = server;
    this.roomId = roomId;
    this.roomMaster = roomMaster;
    this.players = [roomMaster];
  }

  getRoomId() {
    return this.roomId;
  }

  getRoomMaster() {
    return this.roomMaster;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  startGame() {
    this.server.sockets.to(this.roomId).emit('receive_message', {
      type: 'game',
      message: 'prepare_start',
    });
  }
}
