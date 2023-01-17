import { Module } from '@nestjs/common';
import { GamePlayService } from './gamePlay.service';
import { Player } from './player.service';
import { Room } from './room.service';

@Module({
  exports: [GamePlayService, Player, Room],
  providers: [GamePlayService, Player, Room],
})
export class GamePlayModule {}
