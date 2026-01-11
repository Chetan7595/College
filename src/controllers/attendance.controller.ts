import type { Request, Response } from "express";

export const startAttendance = async (req: Request, res: Response) => {
    res.json({ message: "Attendance started" });
};
