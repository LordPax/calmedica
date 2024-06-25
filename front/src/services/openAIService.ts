import OpenAI from 'openai';

export type Message =
    | OpenAI.Chat.ChatCompletionMessage
    | OpenAI.Chat.ChatCompletionUserMessageParam
    | OpenAI.Chat.ChatCompletionSystemMessageParam;

export type ChatCompletion = OpenAI.Chat.ChatCompletion;

const openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chat = (
    messages: Message[],
    model: string = 'gpt-4o',
): Promise<ChatCompletion> => {
    return openai.chat.completions.create({
        model,
        messages,
    });
};