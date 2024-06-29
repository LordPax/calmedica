const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export interface Message {
    id: number;
    content: string;
    sender_id?: number;
    phone: string;
    attachment?: string[];
    ai_response?: string;
    images_sentiment?: string;
    sentiment?: string;
    sentiment_rate?: number;
    created_at: string;
    updated_at: string;
}

export const fetchMessages = async (telPortable: string, accessToken: string) => {
    try {
        const response = await fetch(
            `${BASE_URL}/messages/phone/${telPortable.replace(/\s+/g, '')}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch messages.');
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};
