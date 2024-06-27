'use client';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useSession } from '@/context/sessionProvider';

export const LogoutButton = () => {
    const { setAccessToken, setRefreshToken } = useSession();

    const logout = useMutation({
        mutationFn: async () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setAccessToken(null);
            setRefreshToken(null);
        },
    });

    return (
        <Button
            size="sm"
            onClick={() => {
                logout.mutate();
            }}
        >
            {logout.isPending ? (
                <Loader className="mr-2 h-4 w-4" />
            ) : (
                <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
        </Button>
    );
};