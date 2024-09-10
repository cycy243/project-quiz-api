import ITokenValidator from "../iTokenValidator";
import * as jwt from "jsonwebtoken";

export default class BearerTokenValidator implements ITokenValidator {
    constructor(private audience: string, private issuer: string, private validity: string, private secret: string) {}

    isValidToken(token: string, roles: Array<string>): Promise<boolean> {
        try {
            const decodedToken = jwt.verify(token, this.secret);
            const decodedRoles = (decodedToken as any).roles as string[];
            if(roles.length == 0) {
                return Promise.resolve(true);
            }
            if(decodedRoles.length != roles.length) return Promise.resolve(false);
            console.log(decodedRoles);
            
            for (let index = 0; index < decodedRoles.length; index++) {
                if(!roles.includes(decodedRoles[index])) {
                    return Promise.resolve(false);
                }
            }
            
            return Promise.resolve(true);
        } catch(err) {
            return Promise.resolve(false);
        }
    }

}