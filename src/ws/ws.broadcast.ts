import WebSocket from "ws";
import { WSMessage } from "./ws.types.js";

export const clients = new Set<WebSocket>();

export function broadcast(message: WSMessage) {
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }
}
