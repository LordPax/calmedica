import Link from 'next/link';
import { AuthButton } from '@/components/features/auth/AuthButton';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-white">
            <Link href="/" className="text-2xl font-bold sm:text-3xl animate-slide-in-left">
                Cal<span className="text-orange-500">Medica</span>
            </Link>
            <div className="animate-slide-in-left-3 flex gap-x-6 place-items-center">
                <AuthButton />
            </div>
        </header>
    );
}
