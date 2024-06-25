import ChatBot from "@/components/features/chatbot/index";
import Datatable from "@/components/features/datatable/Datatable";
import Header from '@/components/layout/Header';

export default async function HomePage() {
    return (
        <>
            <Header/>
            <Datatable />   
            <ChatBot />
        </>
    );
}
