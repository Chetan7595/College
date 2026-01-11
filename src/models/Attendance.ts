import { Schema, model, Types, Document } from "mongoose";

export type AttendanceStatus = "present" | "absent";

export interface IAttendance extends Document {
    classId: Types.ObjectId;
    studentId: Types.ObjectId;
    status: AttendanceStatus;
}

const classSchema = new Schema<IAttendance>(
    {
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["present", "absent"], required: true },
    },
    {
        timestamps: true,
    }
);

export const AttendanceModel = model<IAttendance>("Attendance", classSchema);
