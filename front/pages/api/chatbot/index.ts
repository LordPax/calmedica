import { ChatCompletion, chat, Message } from '@/services/openAIService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST')
        return res.status(400).json({ message: 'Invalid method' });

    let { messages } = req.body;
    if (!messages)
        return res.status(400).json({ message: 'Missing message' });

    const response: ChatCompletion = await chat(messages);
    messages = [...messages, { ...response.choices[0].message }];

    return res.status(200).json({ messages });
}
