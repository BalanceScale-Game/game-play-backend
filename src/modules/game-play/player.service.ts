import { Injectable } from '@nestjs/common';

@Injectable()
export class Player {
  constructor(private userId: string) {
    this.userId = userId;
  }

  getId() {
    return this.userId;
  }
}
