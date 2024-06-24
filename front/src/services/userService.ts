import prisma from '../lib/prisma';
import { Like, findLikeByRecipeId } from '@/services/likeService';

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
    role?: string;
    createdAt?: Date;
}

export const findOneUser = (
    id: string,
    select?: Record<string, boolean>,
): Promise<User | null> => {
    return prisma.user.findUnique({
        select,
        where: {
            id,
        },
    });
};

export const findUserByRecipeId = async (recipeId: string): Promise<User[]> => {
    const likes: Like[] = await findLikeByRecipeId(recipeId);

    if (!likes) return [];

    return await Promise.all(
        likes.map(async (like) => {
            const user: User | null = await findOneUser(like.userId);
            return user as User;
        }),
    );
}
