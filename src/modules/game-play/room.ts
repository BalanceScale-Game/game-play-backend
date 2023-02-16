import { GameResult } from './dto';
import { Player } from './player';

export class Room {
  private roomMaster: Player;
  private players: Player[];

  public roundInProgress: boolean;
  public currentRound: number;
  public gameState: 'prepare' | 'in_progress' | 'ended';

  constructor(private roomId: string, private roomMasterId: string) {
    this.roomId = roomId;
    const roomMaster = new Player(roomMasterId);
    this.roomMaster = roomMaster;
    this.players = [roomMaster];
    this.roundInProgress = false;
    this.currentRound = 0;
    this.gameState = 'prepare';
  }

  getRoomId() {
    return this.roomId;
  }

  getRoomMaster() {
    return this.roomMaster;
  }

  getPlayers() {
    return this.players;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayerById(id: string): Player {
    const player = this.players.filter((item) => item.getId() === id)?.[0];

    return player;
  }

  roundStart() {
    this.currentRound++;
    this.roundInProgress = true;

    // Reset chosenNumber
    this.players.forEach((player) => player.chooseNumber(0));
  }

  chooseNumber(userId: string, chosenNumber: number) {
    if (this.roundInProgress) {
      const player = this.getPlayerById(userId);

      player.chooseNumber(chosenNumber);
    }
  }

  calculateAverage(): number {
    const average =
      this.players.reduce((prev, cur) => prev + cur.getChosenNumber(), 0) /
      this.players.length;

    return average;
  }

  calculateGameResult(): GameResult {
    console.log('Calculate....');
    const playerIdsClosestAverage: string[] = [];
    const average = this.calculateAverage();
    const goal = average * 0.8;
    let maxClosest = 0;

    this.players.forEach((item) => {
      const chosenNumber = item.getChosenNumber();
      const difference = Math.abs(chosenNumber - goal);
      if (difference > maxClosest) {
        maxClosest = chosenNumber;
      }
    });

    this.players.forEach((player) => {
      if (player.getChosenNumber() != maxClosest) {
        playerIdsClosestAverage.push(player.getId());
      } else {
        player.decreaseScore();
      }
    });

    const losingPlayers = this.getLosingPlayers();
    const isEndGame = this.isEndGame();

    return {
      winners: playerIdsClosestAverage,
      losingPlayers: losingPlayers,
      players: this.players,
      isEndGame,
    };
  }

  getLosingPlayers(): string[] {
    const losingPlayers: string[] = [];

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.getScore() <= 0) {
        losingPlayers.push(player.getId());
        this.players.splice(i, 1);
      }
    }

    return losingPlayers;
  }

  isEndGame() {
    const isEndGame =
      this.players.filter((player) => player.getScore() > 0).length <= 1;
    if (isEndGame) this.gameState = 'ended';

    return isEndGame;
  }
}
