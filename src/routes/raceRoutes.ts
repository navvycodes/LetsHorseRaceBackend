import { Router } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config/config";

import { RequestResponse } from "../utils/apiResponse";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateRequestSchemaWithZod } from "../middleware/validateSchemasZod";
import {
  createGameRequestSchema,
  joinGameRequestSchema,
  postRaceFinishDrinkHandoutRequestSchema,
  readyUpRequestSchema,
} from "../utils/messageSchemas";
import {
  createRace,
  joinRace,
  postRaceFinishDrinkHandout,
  readyUp,
} from "../controllers/raceController";

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
router.post(
  "/createRace",
  apiLimiter,
  authenticateToken,
  validateRequestSchemaWithZod(createGameRequestSchema, "body"),
  createRace
);

// Route to join a game
router.post(
  "/joinRace",
  apiLimiter,
  authenticateToken,
  validateRequestSchemaWithZod(joinGameRequestSchema, "body"),
  joinRace
);

// Route to mark player as ready
router.post(
  "/markPlayerReady",
  apiLimiter,
  authenticateToken,
  validateRequestSchemaWithZod(readyUpRequestSchema, "body"),
  readyUp
);

// Route to handle post game drink handout
router.post(
  "/postRaceFinishDrinkHandout",
  apiLimiter,
  authenticateToken,
  validateRequestSchemaWithZod(postRaceFinishDrinkHandoutRequestSchema, "body"),
  postRaceFinishDrinkHandout
);

export default router;
