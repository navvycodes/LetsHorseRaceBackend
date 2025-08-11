import { Router } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config/config";

import { RequestResponse } from "../utils/apiResponse";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateRequestSchemaWithZod } from "../middleware/validateSchemasZod";
import { joinGameRequestSchema } from "../utils/messageSchemas";
import { createGame, joinGame } from "../controllers/raceController";

const router = Router();
const apiLimiter = rateLimit({
  windowMs: config.tokenRateLimiting.windowMs,
  max: config.tokenRateLimiting.maxRequests,
  handler: (_req, res) => {
    RequestResponse(
      res,
      429,
      false,
      "Too many requests, please try again later."
    );
  },
});

// Route to create a game
router.get("/createGame", apiLimiter, authenticateToken, createGame);

// Route to join a game
router.post(
  "/joinGame",
  apiLimiter,
  authenticateToken,
  validateRequestSchemaWithZod(joinGameRequestSchema, "body"),
  joinGame
);

export default router;
