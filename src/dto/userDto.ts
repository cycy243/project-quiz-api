export type UserDto = {
    name: string | null,
    password?: string | null,
    email: string | null,
    birthDate: Date | null,
    pseudo: string | null,
    bio: string | null,
    firstname: string,
    profilePicUri: string | null
}