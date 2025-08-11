import app from "./app";
import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config/config";
import { handleMessage } from "./websocket/wss";
import { success } from "zod";
import { removeConnection } from "./horse_racing/GameStates";

// Initialize Express and HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  let gameCode: string | null = null;
  ws.on("message", (message: string) => {
    const response = handleMessage(ws, message);
    if (response.success && response.gameCode) {
      gameCode = response.gameCode;
    }
    ws.send(JSON.stringify({ response, success }));
  });

  ws.on("close", () => {
    if (gameCode) {
      removeConnection(gameCode, ws);
    }
  });

  ws.send("Connected to Horse Racing WebSocket server!");
});

server.listen(config.port, () => {
  console.log(`WebSocket server running on http://localhost:${config.port}`);
});
