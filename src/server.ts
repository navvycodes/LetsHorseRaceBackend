import app from "./app";
import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config/config";
import { handleMessage } from "./websocket/wss";

// Initialize Express and HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const response = handleMessage(message);
    ws.send(response);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Connected to Horse Racing WebSocket server!");
});

server.listen(config.port, () => {
  console.log(`WebSocket server running on http://localhost:${config.port}`);
});
