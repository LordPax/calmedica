import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const microphone = async (base64Audio: string, model: string = 'whisper-1') => {
    const audio = Buffer.from(base64Audio, "base64");

    // Use an absolute path for the tmp directory
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const filePath = path.join(tmpDir, 'input.wav');

    try {
        fs.writeFileSync(filePath, audio);
        const readStream = fs.createReadStream(filePath);

        const data = await openai.audio.transcriptions.create({
            file: readStream,
            model,
        });

        fs.unlinkSync(filePath);

        return data;
    } catch (error) {
        console.error("Error processing audio:", error);
        throw new Error("Error processing audio transcription");
    }
};
