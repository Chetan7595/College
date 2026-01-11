import { Router } from "express";
import { startAttendance } from "../controllers/attendance.controller.js";
import { teacherRoleMiddleWare } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/start", teacherRoleMiddleWare, startAttendance);

export default router;
