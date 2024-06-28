const BASE_URL = `${process.env.BACKEND_URL}`;

export const fetchUsers = async (accessToken: string) => {
    try {
        const response = await fetch(
            `${BASE_URL}/patients`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};
