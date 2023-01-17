import { OnModuleDestroy, OnModuleInit, Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Topic } from './dto/types';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'king-diamond',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'king-diamond-consumer',
      },
    },
  })
  private readonly client: ClientKafka;

  async onModuleInit() {
    const requestPatterns: Topic[] = ['auth.get.user', 'create.room'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  public async sendKafkaMessage(
    topic: Topic,
    key: string,
    data: any,
  ): Promise<Observable<any>> {
    const result = await lastValueFrom(
      this.client.send(topic, {
        key: key,
        value: data,
      }),
    );
    return result;
  }

  async sendKafkaMessageWithoutKey(
    topic: Topic,
    data: any,
  ): Promise<Observable<any>> {
    const result = await lastValueFrom(
      this.client.send(topic, {
        value: data,
      }),
    );
    return result;
  }

  async sendNotification(): Promise<any> {
    return this.client.emit('notify', { notify: true });
  }
}
