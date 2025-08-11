import { generateGameCode } from "../utils/generateGameCode";
import { createGameRequestSchema } from "../utils/messageSchemas";

export const handleMessage = (message: string): string => {
  let parseMessage;
  try {
    parseMessage = JSON.parse(message.toString());
  } catch (error) {
    console.error("Failed to parse message:", error);
    return JSON.stringify({ error: "Invalid message format" });
  }
  // Handle Different Message Types
  switch (parseMessage.messageName) {
    case "CREATE_GAME":
      // Handle create game logic here
      const validationResult = createGameRequestSchema.safeParse(parseMessage);
      if (!validationResult.success) {
        return JSON.stringify({ error: validationResult.error.message });
      }
      const gameCode = generateGameCode();
      return JSON.stringify({ messageName: "GAME_CREATED", gameCode });
    case "JOIN_GAME":
      // Handle join game logic here
      break;
    default:
      return JSON.stringify({ error: "Unknown message type" });
  }
  return JSON.stringify({ error: "Unknown message type" });
};
