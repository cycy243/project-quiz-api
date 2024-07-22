import * as mongoose from "mongoose"

export interface IUser {
    name: String,
    firstname: String,
    password: String,
    email: String,
    birthDate: Date,
    pseudo: String,
    bio: String,
    profilePicUri: String
}

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true
    },
    pseudo: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    profilePicUri: {
        type: String,
        required: true,
    }
})

const User = mongoose.model<IUser>('Users', UserSchema)

export default User