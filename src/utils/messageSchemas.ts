import { z } from "zod";
import { allSuitsArray, betTypeArray } from "./types";

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

export { joinGameRequestSchema, startGameRequestSchema };
export type JoinGameRequest = z.infer<typeof joinGameRequestSchema>;
export type StartGameRequest = z.infer<typeof startGameRequestSchema>;
