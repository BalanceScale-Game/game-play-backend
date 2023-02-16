import { WebSocketServer } from '@nestjs/websockets';
import { KafkaService } from '../kafka/kafka.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { Server } from 'socket.io';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

@Injectable()
@UseFilters(AllExceptionsFilter)
export class SocketService {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kafkaService: KafkaService) {}

  async getUserByAuthToken(token: string) {
    try {
      console.log('99999');
      const user: any = await this.kafkaService.sendKafkaMessageWithoutKey(
        'auth.get.user',
        { token },
      );

      return user;
    } catch (ex) {
      console.log(ex);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
