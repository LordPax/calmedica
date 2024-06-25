import ChatBot from "@/components/features/chatbot/index";
import Header from '@/components/layout/Header';

export default async function HomePage() {
    return (
        <>
            <Header/>
            <ChatBot />
        </>
    );
}
