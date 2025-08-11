import { generateDeckAndLegs } from "../utils/generateDeckAndLegs";
import { WebSocket } from "ws";
import { HorseRacingMaps, Player } from "../utils/types";

const DEFAULT_NUM_LEGS = 10;
const DEFAULT_NUM_DECKS = 1;

export const gameConnections: { [gameCode: string]: Set<WebSocket> } = {};

export function addConnection(gameCode: string, ws: WebSocket) {
  if (!gameConnections[gameCode]) {
    gameConnections[gameCode] = new Set();
  }
  gameConnections[gameCode].add(ws);
}

export function removeConnection(gameCode: string, ws: WebSocket) {
  gameConnections[gameCode]?.delete(ws);
  if (gameConnections[gameCode]?.size === 0) {
    delete gameConnections[gameCode];
    delete horseRaceStates[gameCode];
  }
}

export function broadcastToGame(gameCode: string, message: any) {
  const data = JSON.stringify(message);
  gameConnections[gameCode]?.forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(data);
  });
}

export const horseRaceStates: HorseRacingMaps = {};

export const generateNewGameState = (gameCode: string) => {
  if (horseRaceStates[gameCode]) {
    throw new Error(`Game with code ${gameCode} already exists`);
  }
  const { deck, legs } = generateDeckAndLegs(
    DEFAULT_NUM_LEGS,
    DEFAULT_NUM_DECKS
  );
  horseRaceStates[gameCode] = {
    players: {},
    deck: deck,
    legs: legs,
    horseStates: {
      Clubs: 0,
      Diamonds: 0,
      Hearts: 0,
      Spades: 0,
      minHorsePosition: 1,
      maxHorsePosition: DEFAULT_NUM_LEGS - 1,
    },
    gameStarted: false,
    gameEnded: false,
    winner: null,
    timeCreated: new Date(),
  };
};

export const hasGame = (gameCode: string): boolean => {
  return !!horseRaceStates[gameCode];
};

export const cleanupOldGames = (maxAgeMinutes: number = 60) => {
  const now = Date.now();
  Object.entries(horseRaceStates).forEach(([code, state]) => {
    const age = (now - new Date(state.timeCreated).getTime()) / 60000;
    if (state.gameEnded || age > maxAgeMinutes) {
      delete horseRaceStates[code];
    }
  });
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
  if (!gameState) {
    throw new Error(`Game with code ${gameCode} does not exist`);
  }
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

export const allPlayersReady = (gameCode: string): boolean => {
  const gameState = getGameState(gameCode);
  if (!gameState) {
    throw new Error(`Game with code ${gameCode} does not exist`);
  }
  return Object.values(gameState.players).every((player) => player.isReady);
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

export const endGame = (gameCode: string, winner: string | null = null) => {
  const gameState = getGameState(gameCode);
  if (gameState) {
    gameState.gameEnded = true;
    gameState.winner = winner;
  }
};
