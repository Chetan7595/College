import type { Request, Response } from "express";
import { attendanceStartSchema } from "../schemas/attendance.schema.js";
import { ClassModel } from "../models/Class.js";

let activeSession = null;

export const startAttendance = async (req: Request, res: Response) => {
    try {
        const { success, data } = attendanceStartSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }
        const classDb = await ClassModel.findById(data.classId);
        if (!classDb) {
            return res.status(404).json({
                success: false,
                error: "Class not found",
            });
        }
        if (
            !req.userId ||
            !classDb.teacherId ||
            classDb.teacherId.toString() !== req.userId
        ) {
            return res.status(403).json({
                success: false,
                error: "Forbidden, not class teacher",
            });
        }

        const startedAt = new Date().toISOString();

        (global as any).activeSession = {
            classId: data.classId,
            startedAt,
            attendance: {},
        };

        res.json({
            success: true,
            data: {
                classId: data.classId,
                startedAt: startedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
