import { Player } from '../player';

export type GameResult = {
  winners: string[];
  losingPlayers: string[];
  players: Player[];
  isEndGame: boolean;
};
