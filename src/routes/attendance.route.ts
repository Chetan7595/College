import { Router } from "express";
import { startAttendance } from "../controllers/attendance.controller.js";
import {
    authMiddleware,
    teacherRoleMiddleWare,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/start", authMiddleware, teacherRoleMiddleWare, startAttendance);

export default router;
