import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { microphone } from '@/services/microphoneService';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ message: 'Invalid method' });
    }

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error parsing the form' });
        }

        const audioFile = files.audio?.[0];

        if (!audioFile) {
            return res.status(400).json({ message: 'Missing audio file' });
        }

        try {
            const audioBuffer = await fs.readFile(audioFile.filepath);
            const base64Audio = audioBuffer.toString('base64');
            const response = await microphone(base64Audio, 'whisper-1');
            return res.status(200).json({ response });
        } catch (error) {
            return res.status(500).json({ message: 'Error processing audio' });
        }
    });
}
