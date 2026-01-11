import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
    {
        className: String,
        teacherId: { type: mongoose.Types.ObjectId, ref: "User" },
        studentIds: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

export const ClassModel = mongoose.model("Classes", classSchema);
