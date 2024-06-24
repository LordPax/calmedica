'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { PropsWithChildren } from 'react';


const queryClient = new QueryClient();

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
