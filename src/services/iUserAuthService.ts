import { ConnectUserDto } from "../dto/auth/connectUserDto";
import { RegisterUserDto } from "../dto/auth/registerUserDto";
import { UserDto } from "../dto/userDto";

export default interface IUserAuthService {

    registerUser(dto: RegisterUserDto): Promise<UserDto | null>

    /**
     * Connect the user
     * 
     * @param login     User's mail or pseudo
     * @param password  User's account password
     * 
     * @returns a promise containing either the user data (with a token for the connection) or null, if the connection wasn't successfull
     */
    connectUserWithLogin(dto: ConnectUserDto): Promise<UserDto | null>
}