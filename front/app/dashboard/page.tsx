"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/sessionProvider';
import ChatBot from "@/components/features/chatbot/index";
import Datatable from "@/components/features/datatable/Datatable";
import Header from '@/components/layout/Header';
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
