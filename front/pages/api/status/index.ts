import { NextApiRequest, NextApiResponse } from 'next';
import { fetchMessages } from '@/services/datatableService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Invalid method' });
    }

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const users = await fetchMessages(authorization);
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
