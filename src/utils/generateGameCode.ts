import { config } from "../config/config";
import { horseRaceStates } from "../horse_racing/GameStates";

export const generateGameCode = (): string => {
  const MAX_ATTEMPTS = config.uuidCreation.maxTries || 5;
  let attempts = 0;
  let code: string;

  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      throw new Error(
        "Unable to generate a unique game code after many attempts."
      );
    }
  } while (horseRaceStates[code]);

  return code;
};
