export interface ActiveSession {
    classId: string;
    startedAt: string;
    attendance: Record<string, string>;
}

export let activeSession: ActiveSession | null = null;

/* getters */
export function getActiveSession(): ActiveSession | null {
    return activeSession;
}

/* setters */
export function startSession(classId: string, startedAt: string) {
    activeSession = {
        classId,
        startedAt,
        attendance: {},
    };
}

export function endSession() {
    activeSession = null;
}
