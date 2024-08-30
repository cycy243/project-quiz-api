import { IUser } from "../../models/user";

export default interface ITokenValidator {
    isValidToken(token: string): Promise<boolean>
}