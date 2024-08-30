import ITokenValidator from "../iTokenValidator";
import * as jwt from "jsonwebtoken";

export default class BearerTokenValidator implements ITokenValidator {
    constructor(private audience: string, private issuer: string, private validity: string, private secret: string) {}

    isValidToken(token: string): Promise<boolean> {
        try {
            jwt.verify(token, this.secret);
            return Promise.resolve(true);
        } catch(err) {
            return Promise.resolve(false);
        }
    }

}