'use client';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { LogIn } from 'lucide-react';
// import { signIn } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';

export const LoginButton = () => {
    // const { trigger, isMutating } = useSWRMutation('auth', signIn);

    // return (
    //     <Button onClick={() => trigger()} className="px-4 py-2 text-sm border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300 sm:px-6 sm:py-2 sm:text-base">
    //         {isMutating ? <Loader /> : <LogIn className="mr-2 h-4 w-4" />}
    //         Get Started
    //     </Button>
    // );
};
