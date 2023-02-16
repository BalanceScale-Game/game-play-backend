import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './modules/socket/socket.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { GamePlayModule } from './modules/game-play/gamePlay.module';
import { TaskSchedulingModule } from './modules/task-scheduling/taskScheduling.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SocketModule,
    GamePlayModule,
    KafkaModule,
    TaskSchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
