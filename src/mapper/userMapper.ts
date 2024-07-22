import { UserDto } from "../dto/userDto";
import { IUser } from "../models/user";

function toDto(user: IUser): UserDto {
    return {
        bio: user.bio,
        birthDate: user.birthDate,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        pseudo: user.pseudo,
        profilePicUri: user.profilePicUri
    }
}

function toEntity(user: UserDto): IUser {
    return {
        bio: user.bio || "",
        birthDate: user.birthDate || new Date(),
        name: user.name || "",
        firstname: user.firstname || "",
        email: user.email || "",
        pseudo: user.pseudo || "",
        profilePicUri: user.profilePicUri || "",
        password: user.password || ""
    }
}

export default { toDto, toEntity }