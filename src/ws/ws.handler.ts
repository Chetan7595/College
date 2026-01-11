import { WebSocket } from "ws";
import { Request } from "express";
import { wsAuth } from "./ws.auth.js";
import { WSMessage } from "./ws.types.js";
import { activeSession } from "../store/attendanceSession.js";
import { broadcast, clients } from "./ws.broadcast.js";

export const wsHandler = (ws: WebSocket, req: Request) => {
    const user = wsAuth(ws, req);
    if (!user) return;
    clients.add(ws);
    ws.on("message", (message: WSMessage) => {
        message = JSON.parse(message.toString());
        switch (message.event) {
            case "ATTENDANCE_MARKED":
                handleAttendanceMarked(ws, message.data, user);
                break;
            case "TODAY_SUMMARY":
                handleTodaySummary(ws, user);
                break;
            case "MY_ATTENDANCE":
                handleMyAttendance(ws, user);
                break;
            case "DONE":
                handleDone(ws, user);
                break;
        }
    });
};

const handleAttendanceMarked = (ws: WebSocket, data: any, user: any) => {
    if (user.role !== "teacher") {
        ws.send(
            JSON.stringify({
                event: "ERROR",
                data: { message: "Forbidden, teacher event only" },
            })
        );
        return;
    }
    if (!activeSession) {
        ws.send(
            JSON.stringify({
                event: "ERROR",
                data: { message: "No active attendance session" },
            })
        );
        return;
    }
    const { studentId, status } = data;
    activeSession.attendance[studentId] = status;
    broadcast({
        event: "ATTENDANCE_MARKED",
        data: { studentId, status },
    });
};

const handleTodaySummary = (ws: WebSocket, user: any) => {
    if (user.role !== "teacher") {
        ws.send(
            JSON.stringify({
                event: "ERROR",
                data: { message: "Forbidden, teacher event only" },
            })
        );
        return;
    }
};

const handleMyAttendance = (ws: WebSocket, user: any) => {};

const handleDone = (ws: WebSocket, user: any) => {};
