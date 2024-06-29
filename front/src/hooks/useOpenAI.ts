import { useState, useCallback } from 'react';
import { Message } from '@/services/openAIService';

export const useOpenAI = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const addContext = useCallback((message: string) => {
        const newMessage: Message = { role: 'system', content: message };
        console.log('Adding context message:', newMessage);
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            console.log('Updated messages array:', updatedMessages);
            return updatedMessages;
        });
    }, []);

    const sendMessage = async (message: string, phone: string) => {
        setLoading(true);

        const newMessage: Message = { role: 'user', content: message };
        const newMessages: Message[] = [
            ...messages,
            newMessage,
        ];

        setMessages(newMessages);

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    messages: newMessages
                }),
            });

            const response = await result.json();

            // Ensure the response messages are of type Message[]
            const responseMessages: Message[] = response.messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
            }));

            setMessages(responseMessages);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMicrophoneData = async (audioFile: string | Blob) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('audio', audioFile);

        console.log('Sending microphone data:', audioFile);

        try {
            const result = await fetch('/api/microphone', {
                method: 'POST',
                body: formData,
            });

            const response = await result.json();
            console.log('Response from /api/microphone:', response);

            // Ensure the response messages are of type Message[]
            const responseMessages: Message[] = response.messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
            }));

            console.log('Response messages array:', responseMessages);

            setMessages(responseMessages);
        } catch (error) {
            console.error('Error sending microphone data:', error);
        } finally {
            setLoading(false);
        }
    };

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
