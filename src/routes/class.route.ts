import { Router } from "express";
import {
    createClass,
    addStudent,
    getClassById,
    myAttendance,
} from "../controllers/class.controller.js";
import {
    authMiddleware,
    studentRoleMiddleWare,
    teacherRoleMiddleWare,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, teacherRoleMiddleWare, createClass);
router.post(
    "/:id/add-student",
    authMiddleware,
    teacherRoleMiddleWare,
    addStudent
);
router.get("/:id", authMiddleware, getClassById);
router.get(
    "/:id/my-attendance",
    authMiddleware,
    studentRoleMiddleWare,
    myAttendance
);

export default router;
