import ky from 'ky';

const BASE_URL = `${process.env.BACKEND_URL}/auth`;


export const login = async (email: string, password: string) => {
    try {
        const response = await ky.post(`${BASE_URL}/login`, { json: { email, password } }).json();
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await ky.post(`${BASE_URL}/logout`).json();
        return response;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

export const register = async (userData: { email: string; firstname: string; lastname: string; password: string; username: string }) => {
    try {
        const response = await ky.post(`${BASE_URL}/register`, { json: userData }).json();
        return response;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};


