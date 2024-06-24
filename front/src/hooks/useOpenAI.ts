import { useState } from 'react';
import { Message } from '@/services/openAIService';

export const useOpenAI = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const addContext = (message: string) => {
        const messagesTmp: Message[] = [
            ...messages,
            { role: 'system', content: message },
        ];
        setMessages(messagesTmp);
    };

    const sendMessage = async (message: string) => {
        let messagesTmp: Message[] = [
            ...messages,
            { role: 'user', content: message },
        ];
        setMessages(messagesTmp);
        setLoading(true);

        const result: Response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: messagesTmp }),
        });
        const response: { messages: Message[] } = await result.json();

        setLoading(false);
        setMessages(response.messages || []);
    };

    const sendMicrophoneData = async (audioFile: string | Blob) => {
        setLoading(true);

        // Using FormData to send the audio file and the messages
        const formData = new FormData();
        formData.append('audio', audioFile);

        const result = await fetch('/api/microphone', {
            method: 'POST',
            body: formData, // Sending FormData instead of JSON
        });
        const response = await result.json();

        setLoading(false);
        setMessages(response.messages || []);
    }

    return {
        messages,
        sendMicrophoneData,
        setMessages,
        sendMessage,
        loading,
        setLoading,
        addContext,
    };
};
