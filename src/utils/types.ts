import e from "express";

export type BetType = "SHOTS" | "SIPS" | "CANS" | "BEERS";
export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";

export const betTypeArray: BetType[] = ["SHOTS", "SIPS", "CANS", "BEERS"];
export const allSuitsArray: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "Jack"
  | "Queen"
  | "King";

type HorseStates = {
  [key in Suit]: number;
} & {
  minHorsePosition: number;
  maxHorsePosition: number;
};

export type Card = {
  suit: Suit;
  rank: Rank;
};

export type Player = {
  name: string;
  betSize: number;
  suitChosen: Suit;
  betType: BetType;
  isReady: boolean;
};

export type HorseRaceState = {
  players: Record<string, Player>;
  deck: Card[];
  legs: Card[];
  horseStates: HorseStates;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string | null;
  timeCreated: Date;
};

export type HorseRacingMaps = {
  [gameCode: string]: {
    // The player id is the key for the players map
    players: Record<string, Player>;
    deck: Card[];
    legs: Card[];
    horseStates: HorseStates;
    gameStarted: boolean;
    gameEnded: boolean;
    winner: string | null;
    timeCreated: Date;
  };
};

export type JwtPayload = {
  user_id: string;
  iat: number;
  exp: number;
};
