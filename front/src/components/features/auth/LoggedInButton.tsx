'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader } from '@/components/ui/loader';
import { useMutation } from '@tanstack/react-query';
import { LogOut, User2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/sessionProvider';
import { DashboardIcon } from '@radix-ui/react-icons';

interface LoggedInButtonProps {
  user: string;
}

export const LoggedInButton: React.FC<LoggedInButtonProps> = ({ user: userProp }) => {
  const { accessToken, setAccessToken, setRefreshToken } = useSession();
  const router = useRouter();

  const logout = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAccessToken(null);
      setRefreshToken(null);
      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      });
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  if (!accessToken) {
    return null;
  }

  const user = { email: 'user@example.com', name: 'John Doe', image: null };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {user.email ? user.email.slice(0, 2) : '??'}
            </AvatarFallback>
            {user.image && <AvatarImage src={user.image} />}
          </Avatar>
          <span>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 bg-white shadow-lg rounded-md border border-gray-200">
        <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <User2 className="mr-2 h-4 w-4" />
              <span>Mon Compte</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <DashboardIcon className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => logout.mutate()}>
            {logout.isPending ? (
              <Loader className="mr-2 h-4 w-4" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};