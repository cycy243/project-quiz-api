import { Inject, Service } from "typedi";
import { UserDto } from "../../dto/userDto";
import ResourceAlreadyExistError from "../../errors/resourceAlreadyExistError";
import userMapper from "../../mapper/userMapper";
import { IUserRepository } from "../../repository/iUserRepository";
import IUserService from "../iUserService";
import { InjectionKey } from "../../utils/injection_key";
import UserCUValidator from "../../validator/userCUValidator";
import { ValidationError } from "../../errors/validationError";

@Service(InjectionKey.USER_SERVICE)
export default class UserService implements IUserService {
    private _repository: IUserRepository
    private _crudValidator: UserCUValidator

    constructor(@Inject(InjectionKey.USER_REPOSITORY) repository: IUserRepository, @Inject(InjectionKey.USER_CRUD_VALIDATOR) crudValidator: UserCUValidator) {
        this._repository = repository
        this._crudValidator = crudValidator
    }

    async addUser(dto: UserDto): Promise<UserDto | null> {
        const validationResult = this._crudValidator.validateItem(dto)
        if(validationResult.errors.length > 0) {
            throw new ValidationError("A validation error occured", validationResult.errors)
        }
        console.log(dto);
        
        const existingUser = await this._repository.findBy({ email: dto.email || "", pseudo: dto.pseudo || "" })
        if(existingUser) {
            throw new ResourceAlreadyExistError({ message: `A user with the email: ${dto.email} or the pseudo ${dto.pseudo} already exist` })
        }
        return userMapper.toDto((await this._repository.insert(userMapper.toEntity(dto)))!)
    }
}