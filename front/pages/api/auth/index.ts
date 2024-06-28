import type { NextApiRequest, NextApiResponse } from 'next';
import { login, logout, register } from '@/services/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            const { email, password, action, firstname, lastname, username } = req.body;

            try {
                let response;
                if (action === 'login') {
                    response = await login(email, password);
                } else if (action === 'logout') {
                    response = await logout(req.body);
                } else if (action === 'register') {
                    const userData = { email, firstname, lastname, password, username };
                    response = await register(userData);
                } else {
                    return res.status(400).json({ message: 'Invalid action' });
                }

                return res.status(200).json(response);
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ message: 'Error processing request', error: error.message });
                } else {
                    return res.status(500).json({ message: 'Error processing request', error: 'Unknown error' });
                }
            }

        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}
