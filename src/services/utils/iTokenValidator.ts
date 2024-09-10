import { IUser } from "../../models/user";

export default interface ITokenValidator {
    isValidToken(token: string, roles: Array<string>): Promise<boolean>
}