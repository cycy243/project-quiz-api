import { UserDto } from "../dto/userDto";

export default interface IUserService {

    addUser(dto: UserDto): Promise<UserDto | null>

}