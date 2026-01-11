export interface WSMessage<T = any> {
    event: string;
    data: T;
}

export interface WSUser {
    userId: string;
    role: string;
}
