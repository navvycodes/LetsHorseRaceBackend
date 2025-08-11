import { RequestResponse } from "../utils/apiResponse";
import { generateGameCode } from "../utils/generateGameCode";
import { Request, Response } from "express";

export const createGame = async (req: Request, res: Response) => {
  try {
    const gameCode = generateGameCode();
    RequestResponse(res, 200, true, "Successfully created game", {
      gameCode: gameCode,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error creating game");
  }
};

export const joinGame = async (req: Request, res: Response) => {
  const { gameCode, playerName, betSize } = req.body;

  if (!gameCode || !playerName || !betSize) {
    return RequestResponse(res, 400, false, "Missing required fields");
  }

  try {
    // Here you would typically add the player to the game using the gameCode
    // For now, we just return a success message
    RequestResponse(res, 200, true, "Successfully joined game", {
      gameCode,
      playerName,
      betSize,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error joining game");
  }
};
