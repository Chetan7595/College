import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";

export const getStudents = async (_req: Request, res: Response) => {
    try {
        const students = await UserModel.find({ role: "student" }).select(
            "-password"
        );
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch students", err });
    }
};
