import { File } from "koa-multer"

export type RegisterUserDto = {
    [x: string]: any
    name: string | null,
    password: string | null,
    email: string | null,
    birthDate: string | null,
    pseudo: string | null,
    bio: string | null,
    firstname: string,
    avatar: File | null
}