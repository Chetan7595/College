import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { signupSchema, loginSchema } from "../schemas/auth.schema.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const { success, data } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }

        const userExists = await UserModel.findOne({
            email: data.email,
        });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: "Email already exists",
            });
        }

        const user = await UserModel.create(data);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Signup failed", err });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { success, data } = loginSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                error: "Invalid request schema",
            });
        }

        const user = await UserModel.findOne({ email: data.email });
        if (!user || !(await user.comparePassword(data.password))) {
            return res.status(400).json({
                success: false,
                error: "Invalid email or password",
            });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET!
        );
        res.json({
            success: true,
            data: {
                token: token,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", err });
    }
};

export const me = async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.userId);
    res.json({
        success: true,
        data: {
            _id: user!._id,
            name: user!.name,
            email: user!.email,
            role: user!.role,
        },
    });
};
