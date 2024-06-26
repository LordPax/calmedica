import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Invalid method' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'Missing phone number' });
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/messages/phone/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
