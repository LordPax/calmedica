import { useSession } from '@/context/sessionProvider';
import { LoginButton } from './LoginButton';
import { LoggedInButton } from './LoggedInButton'; // Assurez-vous d'avoir ce composant

//million-ignore
export const AuthButton = () => {
    const { accessToken } = useSession();

    if (accessToken) {
        const user = sessionStorage.getItem('user');
        return <LoggedInButton user={user || ''} />;
    }

    return <LoginButton />;
};