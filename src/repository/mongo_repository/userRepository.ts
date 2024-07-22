import * as mongoose from "mongoose";
import User, { IUser } from "../../models/user";
import { IUserRepository } from "../iUserRepository";
import { UserDto } from "../../dto/userDto";

import * as mapper from '../../mapper/userMapper'

export class UserRepository implements IUserRepository {

    private _model: mongoose.Model<IUser>;

    constructor(model: mongoose.Model<IUser>) {
        this._model = model
    }
    
    async findBy(args: { email?: String; pseudo?: String; id?: String; }): Promise<IUser | null> {
        if(args.email) {
            return await this._model.findOne({$or: [{email: args.email}, {pseudo: args.pseudo}, {id: args.id}]});
        }
        return await this._model.findById(args.id);
    }

    async insert(toAdd: IUser): Promise<IUser | null> {
        const user = new this._model(toAdd);
        await user.save();
        return user;
    }

    async findById(id: String): Promise<IUser | null> {
        return await this._model.findById(id);
    }
    
}