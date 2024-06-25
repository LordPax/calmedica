import ky from 'ky';

const BACKEND_URL = process.env.BACKEND_URL;

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email?: string | null;
    profile_image_url: string;
    created_at: string;
    updated_at: string;
    emailVerified?: Date | null;
    role?: string;
}

export const findOneUser = async (): Promise<User | null> => {
    try {
        const user = await ky.get(`${BACKEND_URL}/users/me`).json<User>();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};
