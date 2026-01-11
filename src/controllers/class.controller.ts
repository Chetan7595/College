import type { Request, Response } from "express";
import { Types } from "mongoose";
import { ClassModel } from "../models/Class.js";
import { addStudentSchema, classSchema } from "../schemas/class.schema.js";
import { UserModel } from "../models/User.js";
import { AttendanceModel } from "../models/Attendance.js";

export const createClass = async (req: Request, res: Response) => {
    try {
        const { success, data } = classSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                error: "User ID is required",
            });
        }

        const newClass = await ClassModel.create({
            className: data.className,
            teacherId: req.userId,
            studentIds: [],
        });

        res.status(201).json({
            success: true,
            data: {
                _id: newClass._id,
                className: newClass.className,
                teacherId: newClass.teacherId,
                studentIds: newClass.studentIds,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Class creation failed", err });
    }
};

export const addStudent = async (req: Request, res: Response) => {
    try {
        const { success, data } = addStudentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }
        const { id } = req.params;

        const classDb = await ClassModel.findById(id);
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

        const updatedClass = await ClassModel.findByIdAndUpdate(
            id,
            { $addToSet: { studentIds: data.studentId } },
            { new: true }
        );

        res.json({
            success: true,
            data: {
                _id: updatedClass?._id,
                className: updatedClass?.className,
                teacherId: updatedClass?.teacherId,
                studentIds: updatedClass?.studentIds,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add student", err });
    }
};

export const getClassById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const classDb = await ClassModel.findById(id);
        if (!classDb) {
            return res.status(404).json({
                success: false,
                error: "Class not found",
            });
        }
        if (
            !req.userId ||
            !classDb.teacherId ||
            (req.userId !== classDb.teacherId.toString() &&
                !classDb.studentIds
                    .map((id) => id.toString())
                    .includes(req.userId))
        ) {
            return res.status(403).json({
                success: false,
                error: "Forbidden, not class member",
            });
        }

        const studentsDb = await UserModel.find({
            _id: { $in: classDb.studentIds },
        });

        res.json({
            success: true,
            data: {
                _id: classDb._id,
                className: classDb.className,
                teacherId: classDb.teacherId,
                students: studentsDb.map((student) => ({
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                })),
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch class", err });
    }
};

export const myAttendance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) return;
        const classDb = await ClassModel.findById(id);
        if (!classDb) {
            return res.status(404).json({
                success: false,
                error: "Class not found",
            });
        }
        if (
            !req.userId ||
            !classDb.studentIds
                .map((sid) => sid.toString())
                .includes(req.userId)
        ) {
            return res.status(403).json({
                success: false,
                error: "Forbidden, not a class student",
            });
        }
        const attendanceRecord = await AttendanceModel.findOne({
            classId: new Types.ObjectId(id),
            studentId: new Types.ObjectId(req.userId),
        });
        res.json({
            success: true,
            data: {
                classId: attendanceRecord?.classId,
                status: attendanceRecord?.status,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch attendance", err });
    }
};
