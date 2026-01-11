import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import classRoutes from "./routes/class.route.js";
import studentRoutes from "./routes/student.route.js";
import attendanceRoutes from "./routes/attendance.route.js";

dotenv.config();

await connectDB();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/class", classRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
