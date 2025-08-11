import { HorseRaceState } from "../utils/types";
import { broadcastToGame, getGameState, horseRaceStates } from "./GameStates";

const shouldFlipLeg = (gameState: HorseRaceState) => {
  // Check if all horses have reached the minimum position
  return Object.values(gameState.horseStates).every(
    (position) => position >= gameState.horseStates.minHorsePosition
  );
};

export const runRace = (gameCode: string) => {
  const gameState = getGameState(gameCode);
  if (!gameState) return;

  let interval = setInterval(() => {
    // Simulate horse movement (update gameState.horseStates here)
    // For example, randomly increment one horse's position:
    const cardSelected = gameState.deck.pop();
    if (!cardSelected) {
      clearInterval(interval);
      return;
    }

    // Assuming cardSelected has a suit property
    const randomSuit = cardSelected.suit;
    if (gameState.horseStates[randomSuit] !== undefined) {
      gameState.horseStates[randomSuit]++;
    }

    // Check if all horses hit the minimum position and flip a leg
    let newLeg = null;
    if (shouldFlipLeg(gameState)) {
      gameState.horseStates.minHorsePosition++;
      newLeg = gameState.legs.pop();
      const newLegSuit = newLeg ? newLeg.suit : null;
      if (newLegSuit) {
        gameState.horseStates[newLegSuit] += -1;
      }
    }

    // Broadcast the updated state to all players in the game
    broadcastToGame(gameCode, {
      type: "RACE_UPDATE",
      legFlipped: newLeg,
      cardFlipped: cardSelected,
      horseStates: gameState.horseStates,
    });

    // Check for winner
    if (
      gameState.horseStates[randomSuit] >=
      gameState.horseStates.maxHorsePosition
    ) {
      clearInterval(interval);
      gameState.gameEnded = true;
      gameState.winner = randomSuit;
      const winners = Object.entries(gameState.players)
        .filter(([_, player]) => player.suitChosen === randomSuit)
        .map(([playerId]) => playerId);
      broadcastToGame(gameCode, {
        type: "RACE_FINISHED",
        winningSuit: randomSuit,
        winners,
        horseStates: gameState.horseStates,
      });
    }
  }, 1000);
};
