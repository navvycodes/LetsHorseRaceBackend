import { WebSocket } from "ws";
import { addConnection, hasGame } from "../horse_racing/gameStates";
export const handleMessage = (
  webSocket: WebSocket,
  message: string
): { success: boolean; message: string; gameCode: string | null } => {
  let parseMessage;
  try {
    parseMessage = JSON.parse(message.toString());
  } catch (error) {
    return {
      success: false,
      message: "Invalid message format",
      gameCode: null,
    };
  }
  switch (parseMessage.messageName) {
    case "JOIN_WS":
      if (!parseMessage.gameCode || parseMessage.gameCode.length !== 6) {
        return { success: false, message: "Invalid game code", gameCode: null };
      }
      if (hasGame(parseMessage.gameCode) === false) {
        return {
          success: false,
          message: "Game does not exist",
          gameCode: null,
        };
      } else {
        addConnection(parseMessage.gameCode, webSocket);
      }
      return {
        success: true,
        message: "Successfully joined game",
        gameCode: parseMessage.gameCode,
      };
    case "DRINK_HANDOUT_SUBMIT":
      return {
        success: true,
        message: "Drink handout submitted",
        gameCode: parseMessage.gameCode,
      };
    default:
      return {
        success: false,
        message: "Unknown message type",
        gameCode: null,
      };
  }
};
