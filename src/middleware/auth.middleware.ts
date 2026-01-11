import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid",
        });
    }

    try {
        const { userId, role } = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        req.userId = userId;
        req.role = role;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid",
        });
    }
};

export const teacherRoleMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.role || req.role !== "teacher") {
        return res.status(403).json({
            success: false,
            error: "Forbidden, teacher access required",
        });
    }
    next();
};

export const studentRoleMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.role || req.role !== "student") {
        return res.status(403).json({
            success: false,
            error: "Forbidden, student access required",
        });
    }
    next();
};
