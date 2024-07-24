import { UserDto } from "../dto/userDto";
import { IUser } from "../models/user";

function toDto(user: IUser): UserDto {
    return {
        bio: user.bio.toString(),
        birthDate: user.birthDate,
        name: user.name.toString(),
        firstname: user.firstname.toString(),
        email: user.email.toString(),
        pseudo: user.pseudo.toString(),
        profilePicUri: user.profilePicUri.toString()
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