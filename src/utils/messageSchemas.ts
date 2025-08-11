import { z } from "zod";
import { allSuitsArray, betTypeArray } from "./types";

const createGameRequestSchema = z
  .object({
    playingSpeedInterval: z
      .number()
      .min(1000, "Playing speed interval must be at least 1000ms"),
    numDecks: z.number().min(1, "Number of decks must be at least 1"),
    numLegs: z.number().min(1, "Number of legs must be at least 1"),
  })
  .refine((data) => data.numLegs <= ((data.numDecks - 1) * 52 + 48) / 2, {
    message:
      "Number of legs must not exceed half the total cards in the deck(s)",
    path: ["numLegs"],
  });

const joinGameRequestWebSocketSchema = z.object({
  type: z.literal("JOIN_WS"),
  gameCode: z.string().length(6, "Game code must be 6 characters long"),
});

const joinGameRequestSchema = z.object({
  gameCode: z.string().length(6, "Game code must be 6 characters long"),
  playerName: z.string().min(1, "Player name is required"),
  betSize: z.number().min(1, "Bet size must be at least 1"),
  betType: z.enum(betTypeArray, "Invalid bet type"),
  suit: z.enum(allSuitsArray, "Invalid suit"),
});

const startGameRequestSchema = z.object({
  messageName: z.literal("READY_UP"),
  playerId: z.string().min(1, "Player ID is required"),
  gameCode: z.string().length(6, "Game code must be 6 characters long"),
});

const readyUpRequestSchema = z.object({
  gameCode: z.string().length(6, "Game code must be 6 characters long"),
  isReady: z.boolean(),
});

export {
  createGameRequestSchema,
  joinGameRequestWebSocketSchema,
  joinGameRequestSchema,
  startGameRequestSchema,
  readyUpRequestSchema,
};
export type JoinGameRequest = z.infer<typeof joinGameRequestSchema>;
export type StartGameRequest = z.infer<typeof startGameRequestSchema>;
export type ReadyUpRequest = z.infer<typeof readyUpRequestSchema>;
export type JoinGameRequestWebSocket = z.infer<
  typeof joinGameRequestWebSocketSchema
>;
export type CreateGameRequest = z.infer<typeof createGameRequestSchema>;
