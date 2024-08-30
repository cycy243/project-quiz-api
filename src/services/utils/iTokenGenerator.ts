import { UserDto } from "../../dto/userDto";

export default interface ITokenGenerator {
    generateToken(user: UserDto): Promise<string | null>
}