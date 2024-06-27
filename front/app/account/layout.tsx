import { Layout, LayoutContent } from '@/components/layout/layout';
import {NotLoggedIn} from '@/components/features/errors/NotLoggedIn';
import type { PropsWithChildren } from 'react';

export default async function layout({ children }: PropsWithChildren) {
    // const session = await getAuthSession();

    // if (!session?.user) {
    //     return <NotLoggedIn />;
    // }

    return <LayoutContent>{children}</LayoutContent>;
}
