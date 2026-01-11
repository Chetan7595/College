export interface ActiveSession {
    classId: string;
    startedAt: string;
    attendance: Record<string, boolean>;
}

export let activeSession: ActiveSession | null = null;
