import { Player } from '../player';

export type GameResult = {
  winners: string[];
  losers: string[];
};

export type FinalGameResult = {
  winners: string[];
  losingPlayers: string[];
  players: Player[];
  isEndGame: boolean;
};
