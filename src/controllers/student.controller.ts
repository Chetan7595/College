import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";

export const getStudents = async (_req: Request, res: Response) => {
    try {
        const students = await UserModel.find({ role: "student" });
        res.json({
            success: true,
            data: students.map((student) => ({
                _id: student._id,
                name: student.name,
                email: student.email,
            })),
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch students", err });
    }
};
