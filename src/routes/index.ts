import { Router } from "express";

import authRoutes from "./authRoutes";
import raceRoutes from "./raceRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/race", raceRoutes);

export default router;
