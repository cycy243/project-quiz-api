import { RegisterUserDto } from "../dto/auth/registerUserDto";
import { UserDto } from "../dto/userDto";

export default interface IUserAuthService {

    registerUser(dto: RegisterUserDto): Promise<UserDto | null>

}