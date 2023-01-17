import { KafkaService } from '../kafka/kafka.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  constructor(private readonly kafkaService: KafkaService) {}

  async getUserByAuthToken(token: string) {
    const user: any = await this.kafkaService.sendKafkaMessageWithoutKey(
      'auth.get.user',
      { token },
    );

    return user;
  }

  async createGameRoom(userId: string) {
    const room: any = await this.kafkaService.sendKafkaMessageWithoutKey(
      'create.room',
      { userId },
    );
    return room;
  }
}
