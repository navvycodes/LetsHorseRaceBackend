import { HorseRaceState } from "../utils/types";
import { broadcastToGame, getGameState, horseRaceStates } from "./GameStates";

// Check if all horses have reached the minimum position
const shouldFlipLeg = (gameState: HorseRaceState) => {
  return Object.values(gameState.horseStates).every(
    (position) => position >= gameState.horseStates.minHorsePosition
  );
};

export const runRace = (gameCode: string) => {
  const gameState = getGameState(gameCode);

  if (!gameState) return;
  if (gameState.gameEnded) {
    broadcastToGame(gameCode, {
      type: "RACE_ENDED",
      message: "The race has already ended",
    });
    return;
  }

  const intervalSpeed = gameState?.intervalSpeed || 1000;

  let interval = setInterval(() => {
    // Fetch a card from the top of the deck
    const cardSelected = gameState.deck.pop();
    if (!cardSelected) {
      clearInterval(interval);
      broadcastToGame(gameCode, {
        type: "RACE_ENDED",
        message: "No more cards to draw",
      });
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
      if (newLegSuit && gameState.horseStates[newLegSuit] > 0) {
        gameState.horseStates[newLegSuit] -= 1;
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
        .map(([playerId, player]) => playerId);
      broadcastToGame(gameCode, {
        type: "RACE_FINISHED",
        winningSuit: randomSuit,
        winners,
        allPlayers: gameState.players,
        horseStates: gameState.horseStates,
      });
    }
  }, intervalSpeed);
};
