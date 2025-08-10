import { JwtPayload } from "../../utils/types";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config/config";

// Generate uuid representing a user
const generateUserId = (): string => {
  const uuid = uuidv4();
  return uuid;
};

// Function to generate a JWT token for a given userId
export const generateToken = (): string => {
  const userID = generateUserId();
  const token = jwt.sign({ user_id: userID }, config.jwtSecret, {
    expiresIn: "3h",
  });
  return token;
};

// Function to verify a given JWT token and return the decoded payload or null
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    console.error("[JWT VERIFY ERROR]", {
      token,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
};
