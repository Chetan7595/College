import { z } from "zod";

export const classSchema = z.object({
    className: z.string(),
});

export const addStudentSchema = z.object({
    studentId: z.string(),
});
