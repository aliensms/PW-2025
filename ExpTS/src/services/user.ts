import { Prisma, PrismaClient, User } from "@prisma/client";
import { CreateUserDTO } from "../types/user";
import { compare, genSalt, hash } from "bcryptjs";

const prisma = new PrismaClient()

export const getUsers = async ():Promise<User[]> => {
    return await prisma.user.findMany()
}

export const createUser = async (user: CreateUserDTO):Promise<User> =>{
    const salt = await genSalt();
    const password = await hash(user.password, salt);
    const newUser = {... user, password}
    return await prisma.user.create({data:newUser});
}

export const checkAuth = async (email: string, password : string): Promise<User | null> => {
    const user = await prisma.user.findFirst({ where: { email: email }})
    if (user){
        const isMatch = await compare(password, user.password);
        if (isMatch) {
            return user;
        }
    }
    return null;
}

export const getUser = async(id:string): Promise<User | null> => {
    return await prisma.user.findFirst({ where : { id : id}})
}

export const removeUser = async(id:string): Promise<User> => {
    return await prisma.user.delete({ where : { id : id } })
}

export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
    return await prisma.user.update({ where: { id }, data });
}


export const checkPassword = async (id: string, password: string): Promise<boolean> => {
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (user) {
        return await compare(password, user.password);
    }
    return false;
}


export const updatePassword = async (id: string, password: string): Promise<User> => {
    const salt = await genSalt();
    const newPassword = await hash(password, salt);
    return await prisma.user.update({ where: { id }, data: { password: newPassword} });
}


export const changePassword = async (id: string,currentPassword: string,newPassword: string): Promise<{ success: boolean; }> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return { success: false};
    }

    const isPasswordCorrect = await compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        return { success: false};
    }

    await updatePassword(id, newPassword);

    return { success: true};
};
