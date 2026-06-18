// src/routes/user.routes.js

import express from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/edit/:id", requireAuth, updateProfile);
router.post("/edit/:id", requireAuth, updateProfile);

export default router;
