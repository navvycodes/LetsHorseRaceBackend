import { Router } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config/config";

import { RequestResponse } from "../utils/apiResponse";
import { createJWTToken, verifyJWTToken } from "../controllers/authController";

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

router.post("/generateUserToken", apiLimiter, createJWTToken);

router.post("/verifyUserToken", apiLimiter, verifyJWTToken);

export default router;
