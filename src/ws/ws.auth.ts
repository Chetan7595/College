import jwt, { JwtPayload } from "jsonwebtoken";
import WebSocket from "ws";
import { Request } from "express";
import { WSUser } from "./ws.types.js";

export function wsAuth(
    ws: WebSocket & { user?: WSUser },
    req: Request
): WSUser | null {
    const token = req.query.token as string | undefined;

    if (!token) {
        ws.send(
            JSON.stringify({
                event: "ERROR",
                data: {
                    message: "Unauthorized or invalid token",
                },
            })
        );
        ws.close();
        return null;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload & WSUser;

        ws.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        return ws.user;
    } catch {
        ws.send(
            JSON.stringify({
                event: "ERROR",
                data: {
                    message: "Unauthorized or invalid token",
                },
            })
        );
        ws.close();
        return null;
    }
}
