export class WebsocketService {
    static instance: WebsocketService;
    private ws: WebSocket;
    private event: Record<string, (data: any) => void> = {};

    constructor(token?: string) {
        let url = process.env.SOCKET_URL || 'ws://localhost:8080/ws'

        if (token) {
            url += `?token=${token}`
        }

        this.ws = new WebSocket(url);
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.event[data.command]) {
                this.event[data.command](data.message);
            }
        };
    }

    static getInstance(token?: string): WebsocketService {
        if (!WebsocketService.instance)
            WebsocketService.instance = new WebsocketService(token);

        return WebsocketService.instance;
    }

    on(event: string, callback: (data: any) => void): void {
        this.event[event] = callback;
    }

    emit(event: string, data: any): void {
        this.ws.send(JSON.stringify({ command: event, message: data }));
    }
}
