'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';
import { SessionProvider } from '@/context/sessionProvider';
const queryClient = new QueryClient();

//million-ignore
export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-right" />
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
};