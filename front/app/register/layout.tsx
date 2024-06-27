import { LayoutContent } from '@/components/layout/layout';
import type { PropsWithChildren } from 'react';

export default async function layout({ children }: PropsWithChildren) {

    return <LayoutContent>{children}</LayoutContent>;
}
