import { generateDeckAndLegs } from "../utils/generateDeckAndLegs";
import { HorseRacingMaps, Player } from "../utils/types";

export const horseRaceStates: HorseRacingMaps = {};

const DEFAULT_NUM_LEGS = 10;
const DEFAULT_NUM_DECKS = 1;
export const generateNewGameState = (gameCode: string) => {
  const { deck, legs } = generateDeckAndLegs(
    DEFAULT_NUM_LEGS,
    DEFAULT_NUM_DECKS
  );
  horseRaceStates[gameCode] = {
    players: {},
    deck: deck,
    legs: legs,
    horseStates: {
      CLUBS: 0,
      DIAMONDS: 0,
      HEARTS: 0,
      SPADES: 0,
      currentLeg: 0,
      minHorsePosition: 0,
      maxHorsePosition: DEFAULT_NUM_LEGS - 1,
    },
    gameStarted: false,
    gameEnded: false,
    winner: null,
    timeCreated: new Date(),
  };
};

export const clearGameState = (gameCode: string) => {
  if (horseRaceStates[gameCode]) {
    delete horseRaceStates[gameCode];
  }
};

export const getGameState = (gameCode: string) => {
  return horseRaceStates[gameCode] || null;
};

export const addPlayerToGame = (
  gameCode: string,
  playerId: string,
  player: Player
) => {
  const gameState = getGameState(gameCode);
  if (gameState) {
    gameState.players[playerId] = player;
  }
};

export const playerIsReady = (
  gameCode: string,
  playerId: string,
  isReady: boolean
) => {
  const gameState = getGameState(gameCode);
  if (gameState) {
    const player = gameState.players[playerId];
    if (player) {
      player.isReady = isReady;
    }
  }
};

export const removePlayerFromGame = (gameCode: string, playerId: string) => {
  const gameState = getGameState(gameCode);
  if (gameState && gameState.players[playerId]) {
    delete gameState.players[playerId];
  }
};

export const startGame = (gameCode: string) => {
  const gameState = getGameState(gameCode);
  if (gameState) {
    gameState.gameStarted = true;
  }
};
