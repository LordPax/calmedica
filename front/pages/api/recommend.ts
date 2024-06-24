import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chat = (
    messages: OpenAI.Chat.ChatCompletionMessage[],
    model: string = 'gpt-3.5-turbo',
): Promise<OpenAI.Chat.ChatCompletion> => {
    return openai.chat.completions.create({
        model,
        messages,
    });
};
