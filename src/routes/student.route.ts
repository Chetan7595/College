import { Router } from "express";
import { getStudents } from "../controllers/student.controller.js";
import { teacherRoleMiddleWare } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", teacherRoleMiddleWare, getStudents);

export default router;
