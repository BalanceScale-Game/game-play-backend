import { Injectable } from '@nestjs/common';
import { TaskSchedulingService } from '../task-scheduling/taskScheduling.service';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class GamePlayService {
  constructor(
    protected readonly taskSchedulingService: TaskSchedulingService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createGameRoom(userId: string) {
    const room: any = await this.kafkaService.sendKafkaMessageWithoutKey(
      'create.room',
      { userId },
    );
    return room;
  }
}
