import express from "express";
import expressWs from "express-ws";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import classRoutes from "./routes/class.route.js";
import studentRoutes from "./routes/student.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import { wsHandler } from "./ws/ws.handler.js";

dotenv.config();

await connectDB();

const app = express();
const { app: wsApp } = expressWs(app);

wsApp.use(express.json());

wsApp.use("/auth", authRoutes);
wsApp.use("/class", classRoutes);
wsApp.use("/students", studentRoutes);
wsApp.use("/attendance", attendanceRoutes);

wsApp.ws("/ws", wsHandler);

wsApp.listen(3000, () => {
    console.log("Server is running on port 3000");
});
