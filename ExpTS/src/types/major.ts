import { Major } from "@prisma/client";

export type CreateMajorDTO = Pick<Major, "code" | "name" | "description">