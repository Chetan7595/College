import { Router } from "express";
import { getStudents } from "../controllers/student.controller.js";
import {
    authMiddleware,
    teacherRoleMiddleWare,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, teacherRoleMiddleWare, getStudents);

export default router;
