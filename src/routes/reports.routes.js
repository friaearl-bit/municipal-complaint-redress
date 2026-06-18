import express from "express";
import { addToast, addFlash } from "../utils/toast.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import {
  getReportsData,
  showReportsDashboard,
} from "../controllers/reports.controller.js";

const router = express.Router();

// router.use(addToast);
router.use(requireAuth);
// router.use(requireRole(["ADMIN", "STAFF"]));

router.get("/", showReportsDashboard);
router.get("/data", getReportsData);

export default router;
