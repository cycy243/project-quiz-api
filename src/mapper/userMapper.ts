import { UserDto } from "../dto/userDto";
import { getFilesRootFolder } from "../librairies/paths";
import { IUser } from "../models/user";

function toDto(user: IUser): UserDto {
    return {
        bio: user.bio.toString(),
        birthDate: user.birthDate.toDateString(),
        name: user.name.toString(),
        firstname: user.firstname.toString(),
        email: user.email.toString(),
        pseudo: user.pseudo.toString(),
        profilePicUri: `${getFilesRootFolder()}/${user.profilePicUri.toString()}`
    }
}

function toEntity(user: UserDto): IUser {
    return {
        bio: user.bio || "",
        birthDate: new Date(user.birthDate!) || new Date(),
        name: user.name || "",
        firstname: user.firstname || "",
        email: user.email || "",
        pseudo: user.pseudo || "",
        profilePicUri: user.profilePicUri || "",
        password: (user as any).password || ""
    }
}

export default { toDto, toEntity }