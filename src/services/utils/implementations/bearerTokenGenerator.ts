import { UserDto } from "../../../dto/userDto";
import { IUser } from "../../../models/user";
import ITokenGenerator from "../iTokenGenerator";
import * as jwt from "jsonwebtoken";

export default class BearerTokenGenerator implements ITokenGenerator {
    constructor(private audience: string, private issuer: string, private validity: string, private secret: string) {}

    generateToken(user: UserDto): Promise<string | null> {
        return Promise.resolve(jwt.sign(this.generateTokenPayload(user), this.secret, { expiresIn: this.validity, issuer: this.issuer, audience: this.audience }));
    }

    private generateTokenPayload(user: UserDto): object {
        return {
            pseudo: user.pseudo,
            email: user.email,
            roles: [ 'USER' ]
        }
    }

}