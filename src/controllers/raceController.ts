import { AuthenticatedRequest } from "../auth/types";
import {
  addPlayerToGame,
  allPlayersReady,
  generateNewGameState,
  playerIsReady,
  startGame,
} from "../horse_racing/gameStates";
import { runRace } from "../horse_racing/runRace";
import { RequestResponse } from "../utils/apiResponse";
import { generateGameCode } from "../utils/generateGameCode";
import { Response } from "express";

/**
 * The createRace function allows a user to create a new horse racing game.
 * It generates a unique game code and initializes the game state.
 * If the user is not authenticated, it returns a 401 error.
 * If the game is successfully created, it returns the game code.
 */
export const createRace = async (req: AuthenticatedRequest, res: Response) => {
  const { playingSpeedInterval, numDecks, numLegs } = req.body;
  if (!playingSpeedInterval || !numDecks || !numLegs) {
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
    const gameCode = generateGameCode();
    generateNewGameState(gameCode, playingSpeedInterval, numDecks, numLegs);
    RequestResponse(res, 200, true, "Successfully created race", {
      gameCode: gameCode,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error creating game");
  }
};

/**
 * The joinRace function allows a user to join a horse racing game.
 * It requires the user to provide a game code, player name, bet size, bet type, and suit.
 * If any of these fields are missing, it returns a 400 error.
 * If the user is not authenticated, it returns a 401 error.
 * If the user is authenticated, it adds the player to the game state and returns a success message.
 */
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

/**
 * This function will mark the player as ready or not ready in the game state.
 * If the player is ready, it will set the isReady property of the player to true
 * If the player is not ready, it will set the isReady property of the player to false
 */
export const readyUp = async (req: AuthenticatedRequest, res: Response) => {
  const { gameCode, isReady } = req.body;

  if (typeof isReady !== "boolean") {
    return RequestResponse(res, 400, false, "isReady must be a boolean");
  }
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
    playerIsReady(gameCode, req.user.user_id, isReady);
    if (allPlayersReady(gameCode)) {
      startGame(gameCode);
      runRace(gameCode);
    }
    RequestResponse(res, 200, true, "Successfully marked player as ready");
  } catch (error) {
    RequestResponse(res, 500, false, "Error marking player as ready");
  }
};

export const postRaceFinishDrinkHandout = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { gameCode, drinkHandout } = req.body;

  if (!gameCode || !drinkHandout) {
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
    RequestResponse(res, 200, true, "Successfully processed drink handout", {
      gameCode,
      drinkHandout,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error processing drink handout");
  }
};
