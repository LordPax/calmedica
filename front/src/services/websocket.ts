export class WebsocketService {
    static instance: WebsocketService;
    private ws: WebSocket;
    private event: Record<string, (data: any) => void> = {};

    constructor(token: string) {
        const url = `${process.env.NEXT_PUBLIC_SOCKET_URL }?token=${token}`;

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
            WebsocketService.instance = new WebsocketService(token || '');

        return WebsocketService.instance;
    }

    disconnect(): void {
        this.ws.close();
    }

    on(event: string, callback: (data: any) => void): void {
        this.event[event] = callback;
    }

    emit(event: string, data: any): void {
        this.ws.send(JSON.stringify({ command: event, message: data }));
    }
}
