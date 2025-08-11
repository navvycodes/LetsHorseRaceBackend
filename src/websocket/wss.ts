import { WebSocket } from "ws";
import { addConnection, hasGame } from "../horse_racing/GameStates";
export const handleMessage = (
  webSocket: WebSocket,
  message: string
): string => {
  let parseMessage;
  try {
    parseMessage = JSON.parse(message.toString());
  } catch (error) {
    return JSON.stringify({ error: "Invalid message format" });
  }
  switch (parseMessage.messageName) {
    case "JOIN_WS":
      if (!parseMessage.gameCode || parseMessage.gameCode.length !== 6) {
        return JSON.stringify({ error: "Invalid game code" });
      }
      if (hasGame(parseMessage.gameCode) === false) {
        return JSON.stringify({ error: "Game does not exist" });
      } else {
        addConnection(parseMessage.gameCode, webSocket);
      }
      return JSON.stringify({
        success: true,
        message: "Successfully joined game",
        gameCode: parseMessage.gameCode,
      });
    default:
      return JSON.stringify({ error: "Unknown message type" });
  }
};
