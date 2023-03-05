import { FinalGameResult, GameResult } from './dto';
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

  calculateGameResult(): { gameResult: GameResult; dropPoint: number } {
    console.log('Calculate....');
    let gameResult: GameResult;
    let dropPoint = 1;

    gameResult = this.conditionWhenHaveTwoPlayer();

    if (gameResult?.losers?.length > 0) {
      return { gameResult, dropPoint };
    }

    gameResult = this.conditionWhenHaveThreePlayer();
    if (gameResult?.losers?.length > 0) {
      return { gameResult, dropPoint };
    }

    const average = this.calculateAverage();
    const goal = average * 0.8;
    let minDifference = 1000,
      maxClosest;
    gameResult = {
      winners: [],
      losers: [],
    };

    this.players.forEach((item) => {
      const chosenNumber = item.getChosenNumber();
      const difference = Math.abs(chosenNumber - goal);
      if (difference < minDifference) {
        minDifference = difference;
        maxClosest = chosenNumber;
      }
    });

    this.players.forEach((player) => {
      if (player.getChosenNumber() === maxClosest) {
        gameResult.winners.push(player.getId());
      } else {
        gameResult.losers.push(player.getId());
      }
    });

    if (this.players.length === 3 && minDifference < 1) {
      dropPoint = 2;
    }

    return { gameResult, dropPoint };
  }

  getFinalGameResult(): FinalGameResult {
    const { gameResult, dropPoint } = this.calculateGameResult();

    console.log({ gameResult, dropPoint });

    this.players.forEach((player) => {
      if (gameResult.losers.includes(player.getId())) {
        player.decreaseScore(dropPoint);
      }
    });
    const losingPlayers = this.getLosingPlayers();
    const isEndGame = this.isEndGame();

    return {
      isEndGame,
      losingPlayers,
      players: this.players,
      winners: gameResult.winners,
    };
  }

  getLosingPlayers(): string[] {
    const losingPlayers: string[] = [];

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.getScore() <= 0) {
        losingPlayers.push(player.getId());
        this.players.splice(i, 1);
        i--;
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

  conditionWhenHaveTwoPlayer(): GameResult {
    if (this.players.length === 2) {
      const player100Index = this.players.findIndex(
        (player) => player.getChosenNumber() === 100,
      );

      if (player100Index === -1) return;

      if (this.players[1 - player100Index].getChosenNumber() === 0) {
        return {
          winners: [this.players[player100Index].getId()],
          losers: [this.players[1 - player100Index].getId()],
        };
      }
    }
  }

  conditionWhenHaveThreePlayer(): GameResult {
    let theSameNumber: number;

    if (this.players.length === 2) {
      if (
        this.players[0].getChosenNumber() === this.players[1].getChosenNumber()
      ) {
        theSameNumber = this.players[0].getChosenNumber();
      }
    }

    if (this.players.length === 3) {
      if (
        this.players[0].getChosenNumber() ===
          this.players[1].getChosenNumber() &&
        this.players[1].getChosenNumber() === this.players[2].getChosenNumber()
      ) {
        theSameNumber = this.players[0].getChosenNumber();
      }

      if (
        this.players[0].getChosenNumber() ===
          this.players[1].getChosenNumber() ||
        this.players[0].getChosenNumber() === this.players[2].getChosenNumber()
      )
        theSameNumber = this.players[0].getChosenNumber();

      if (
        this.players[1].getChosenNumber() === this.players[2].getChosenNumber()
      )
        theSameNumber = this.players[1].getChosenNumber();
    }

    const winners = [],
      losers = [];

    this.players.forEach((player) => {
      if (player.getChosenNumber() === theSameNumber) {
        losers.push(player.getId());
      } else {
        winners.push(player.getId());
      }
    });

    return {
      winners,
      losers,
    };
  }

  initComPlayer() {
    for (let i = 1; i <= 4; i++) {
      const player = new Player(i.toString());
      this.players.push(player);
    }
  }
}
