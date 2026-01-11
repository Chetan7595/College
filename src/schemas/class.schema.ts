import { z } from "zod";

export const classSchema = z.object({
    className: z.string().min(1),
});

export const addStudentSchema = z.object({
    studentId: z.string().min(1),
});
