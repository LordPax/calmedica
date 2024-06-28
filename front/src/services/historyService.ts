const BASE_URL = `${process.env.BACKEND_URL}`;

export const fetchMessages = async (telPortable: string, accessToken: string) => {
    try {
        const response = await fetch(
            `${BASE_URL}/messages/phone/${telPortable.replace(/\s+/g, '')}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();

        if (data) {
            return data.map((msg:any) => {
                try {
                    const cleanedContent = msg.content.replace(/^'|'$/g, '');
                    const parsed = JSON.parse(cleanedContent);
                    if (parsed && parsed.question && parsed.answer) {
                        return parsed;
                    } else {
                        throw new Error('Invalid JSON structure');
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    return { question: 'Invalid JSON', answer: 'Invalid JSON' };
                }
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};
