import { Inject, Service } from "typedi";
import { UserDto } from "../../dto/userDto";
import ResourceAlreadyExistError from "../../errors/resourceAlreadyExistError";
import userMapper from "../../mapper/userMapper";
import { IUserRepository } from "../../repository/iUserRepository";
import IUserService from "../iUserService";

@Service('user-service')
export default class UserService implements IUserService {
    private _repository: IUserRepository

    constructor(@Inject('user-repo') repository: IUserRepository) {
        this._repository = repository
    }

    async addUser(dto: UserDto): Promise<UserDto | null> {
        const existingUser = await this._repository.findBy({ email: dto.email || "", pseudo: dto.pseudo || "" })
        if(existingUser) {
            throw new ResourceAlreadyExistError({ message: `A user with the email: ${dto.email} or the pseudo ${dto.pseudo} already exist` })
        }
        return this._repository.insert(userMapper.toEntity(dto))
    }
}