import { User } from "@prisma/client";

export type CreateUserDTO = Pick<User, "name" | "email" | "password" | "majorId" >
export type LoginDto = Pick<User, "email" | "password">