import { z } from "zod";

export const attendanceStartSchema = z.object({
    classId: z.string().min(1),
});
