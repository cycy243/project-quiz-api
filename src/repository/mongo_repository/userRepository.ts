import * as mongoose from "mongoose";
import User, { IUser } from "../../models/user";
import { IUserRepository } from "../iUserRepository";
import { UserDto } from "../../dto/userDto";

import * as mapper from '../../mapper/userMapper'
import { DataAccessError } from "../../errors/dataAccessError";
import { Service } from "typedi";
import { InjectionKey } from "../../utils/injection_key";

@Service(InjectionKey.USER_REPOSITORY)
export class UserRepository implements IUserRepository {

    private _model: mongoose.Model<IUser>;

    constructor(model: mongoose.Model<IUser>) {
        this._model = model
    }
    
    async findBy(args: { email?: String; pseudo?: String; id?: String; }): Promise<IUser | null> {
        try {
            console.info(args)
            if(args) {
                return await this._model.findOne({$or: [{email: args.email}, {pseudo: args.pseudo}, {_id: args.id}]});
            }
            return null;
        } catch(err) {
            console.error(err);
            
            if(err instanceof mongoose.MongooseError) {
                throw new DataAccessError({ message: "Error while using mongoose" })
            }
            throw err
        }
    }

    async insert(toAdd: IUser): Promise<IUser | null> {
        console.log("Type of User bithDate field: " + typeof toAdd.birthDate);
        console.log("Value of User bithDate field: " + toAdd.birthDate);
        
        
        const user = new this._model(toAdd);
        await user.save();
        return user;
    }

    async findById(id: String): Promise<IUser | null> {
        return await this._model.findById(id);
    }
    
}