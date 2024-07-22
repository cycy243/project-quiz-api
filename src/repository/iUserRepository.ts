import { UserDto } from "../dto/userDto"
import { IUser } from "../models/user"

export interface IUserRepository {
    findById(id: String): Promise<IUser | null>
    insert(toAdd: IUser): Promise<IUser | null>
    findBy(args: {email?: String, pseudo?: String, id?: String}): Promise<IUser | null>
}