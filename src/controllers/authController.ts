import { generateToken, verifyToken } from "src/auth/jwt/jwt";
import { RequestResponse } from "src/utils/apiResponse";
import { Request, Response } from "express";
import { success } from "zod";

export const createJWTToken = async (req: Request, res: Response) => {
  try {
    const tokenCreated = generateToken();
    RequestResponse(res, 200, true, "Successfully generated token", {
      token: tokenCreated,
    });
  } catch (error) {
    RequestResponse(res, 500, false, "Error generating token");
  }
};

export const verifyJWTToken = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Missing bearer token" });
    return;
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }
    res.status(200).json({ success: true, message: "Valid token " });
  } catch (err) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
    return;
  }
};
