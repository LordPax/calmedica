import { Layout } from '@/components/layout/layout';
import {NotLoggedIn} from '@/components/features/errors/NotLoggedIn';
// import { getAuthSession } from '@/lib/next-auth';
import type { PropsWithChildren } from 'react';

export default async function layout({ children }: PropsWithChildren) {
    // const session = await getAuthSession();

    // if (!session?.user) {
    //     return <NotLoggedIn />;
    // }

    return <Layout>{children}</Layout>;
}
