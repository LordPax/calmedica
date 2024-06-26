import ChatBot from "@/components/features/chatbot/index";
import Header from '@/components/layout/Header';
import { WebsocketService } from '@/services/websocket';

export default async function HomePage() {
    // TODO : finish connecting to websocket
    const ws = WebsocketService.getInstance();

    ws.on('message', (data) => {
        console.log('ws event message', data);
    });

    return (
        <>
            <Header/>
            <ChatBot />
        </>
    );
}
