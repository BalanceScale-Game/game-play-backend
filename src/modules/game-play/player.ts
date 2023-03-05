import { Injectable } from '@nestjs/common';

@Injectable()
export class Player {
  private score: number;
  private chosenNumber: number;

  constructor(private userId: string) {
    this.userId = userId;
    this.score = 10;
  }

  getId() {
    return this.userId;
  }

  getChosenNumber() {
    return this.chosenNumber;
  }

  chooseNumber(chosenNumber: number) {
    this.chosenNumber = chosenNumber;
  }

  getScore() {
    return this.score;
  }

  decreaseScore(dropPoint: number) {
    this.score = this.score - dropPoint;
  }
}
