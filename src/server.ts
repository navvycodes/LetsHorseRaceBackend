import app from "./app";
import http from "http";
import { WebSocketServer } from "ws";
import { generateGameCode } from "./utils/generateGameCode";
import { createGameRequestSchema } from "./utils/messageSchemas";
import { config } from "./config/config";

// Initialize Express and HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message: string) => {
    // Handle incoming messages
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.toString());
    } catch (error) {
      console.error("Failed to parse message:", error);
      ws.send('{ error: "Invalid message format" }');
      return;
    }

    if (parsedMessage.messageName === "CREATE_GAME") {
      const validationResult = createGameRequestSchema.safeParse(parsedMessage);
      if (!validationResult.success) {
        ws.send(JSON.stringify({ error: validationResult.error.message }));
        return;
      } else {
        console.log("Game creation request validated successfully");
      }
      const gameCode = generateGameCode();
      ws.send(JSON.stringify({ messageName: "GAME_CREATED", gameCode }));
      return;
    } else if (parsedMessage.messageName === "JOIN_GAME") {
    }

    console.log(`Received message: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Welcome to the WebSocket server!");
});

server.listen(config.port, () => {
  console.log(`WebSocket server running on http://localhost:${config.port}`);
});
