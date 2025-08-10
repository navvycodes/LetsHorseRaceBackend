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
  CLUBS: number;
  DIAMONDS: number;
  HEARTS: number;
  SPADES: number;
  currentLeg: number;
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
};

export type HorseRacingMaps = {
  [gameCode: string]: {
    players: Player[];
    deck: Card[];
    legs: Card[];
    horseStates: HorseStates;
    gameStarted: boolean;
    gameEnded: boolean;
    winner: string | null;
    timeCreated: Date;
  };
};
