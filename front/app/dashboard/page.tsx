"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/sessionProvider';
import ChatBot from "@/components/features/chatbot/index";
import Datatable from "@/components/features/datatable/Datatable";
import Header from '@/components/layout/Header';
import { WebsocketService } from '@/services/websocket';
import { Loader } from '@/components/ui/loader';

export default function DasbhoardPage() {
    const { accessToken, isInitialized } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isInitialized) {
            if (!accessToken) {
                router.push('/login');
            } else {
                const token = localStorage.getItem('access_token') || '';
                const ws = WebsocketService.getInstance(token);
                ws.on('message:create', (data) => {
                    console.log('ws event create message', data);
                });
                ws.on('message:image', (data) => {
                    console.log('ws event image message', data);
                });
                setIsLoading(false);
            }
        }
    }, [accessToken, isInitialized, router]);

    if (isLoading) {
        return <Loader/>
    }

    return (
        <>
            <Header />
            <Datatable />
            <ChatBot />
        </>
    );
}