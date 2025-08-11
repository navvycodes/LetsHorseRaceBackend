import { AuthenticatedRequest } from "../auth/types";
import { addPlayerToGame, playerIsReady } from "../horse_racing/GameStates";
import { RequestResponse } from "../utils/apiResponse";
import { generateGameCode } from "../utils/generateGameCode";
import { Response } from "express";

export const createRace = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.user_id) {
    return RequestResponse(
      res,
      401,
      false,
      "Unauthorized: User not authenticated"
    );
  }
  try {
    const gameCode = generateGameCode();
    RequestResponse(res, 200, true, "Successfully created race", {
      gameCode: gameCode,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error creating game");
  }
};

export const joinRace = async (req: AuthenticatedRequest, res: Response) => {
  const { gameCode, playerName, betSize, betType, suit } = req.body;

  if (!gameCode || !playerName || !betSize || !betType || !suit) {
    return RequestResponse(res, 400, false, "Missing required fields");
  }

  if (!req.user || !req.user.user_id) {
    return RequestResponse(
      res,
      401,
      false,
      "Unauthorized: User not authenticated"
    );
  }
  const newPlayer = {
    name: playerName,
    betSize: betSize,
    suitChosen: suit,
    betType: betType,
    isReady: false,
  };

  try {
    addPlayerToGame(gameCode, req.user.user_id, newPlayer);
    RequestResponse(res, 200, true, "Successfully joined game", {
      gameCode,
      playerName,
      betSize,
      betType,
      suit,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error joining game");
  }
};

export const readyUp = async (req: AuthenticatedRequest, res: Response) => {
  const { gameCode } = req.body;

  if (!gameCode) {
    return RequestResponse(res, 400, false, "Missing required fields");
  }

  if (!req.user || !req.user.user_id) {
    return RequestResponse(
      res,
      401,
      false,
      "Unauthorized: User not authenticated"
    );
  }

  try {
    // Here you would typically mark the player as ready in the game using the gameCode
    playerIsReady(gameCode, req.user.user_id, true);
    RequestResponse(res, 200, true, "Successfully marked player as ready");
  } catch (error) {
    RequestResponse(res, 500, false, "Error marking player as ready");
  }
};
