export type UserDto = {
    name: string | null,
    email: string | null,
    birthDate: string | null,
    pseudo: string | null,
    bio: string | null,
    firstname: string,
    profilePicUri: string | null,
    token?: string
}