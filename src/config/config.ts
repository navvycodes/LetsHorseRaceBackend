import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Server port
  port: process.env.PORT || 8080,

  // JWT secret for signing tokens
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiry: process.env.JWT_EXPIRY || "3h",

  // Rate limiting configuration for token routes
  tokenRateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20, // limit each IP to 20 requests per windowMs
  },

  // UUID Creation
  uuidCreation: {
    maxTries: 5,
  },
};
