import { NextApiRequest, NextApiResponse } from 'next';
import {fetchMessages} from '@/services/historyService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Invalid method' });
    }

    const { id } = req.query;
    console.log('id:', id);
    console.log('req', req.headers);
    if (!id) {
        return res.status(400).json({ message: 'Missing phone number' });
    }

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const messages = await fetchMessages(id as string, authorization);
        console.log('Messages:', messages);
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
