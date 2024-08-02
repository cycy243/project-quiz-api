import { Inject, Service } from "typedi";
import { UserDto } from "../../dto/userDto";
import ResourceAlreadyExistError from "../../errors/resourceAlreadyExistError";
import userMapper from "../../mapper/userMapper";
import { IUserRepository } from "../../repository/iUserRepository";
import IUserAuthService from "../iUserAuthService";
import { InjectionKey } from "../../utils/injection_key";
import RegisterUserValidator from "../../validator/registerUserValidator";
import { ValidationError } from "../../errors/validationError";
import { RegisterUserDto } from "../../dto/auth/registerUserDto";
import IFileSaverService from "../iFileSaverService";

@Service(InjectionKey.USER_SERVICE)
export default class UserAuthService implements IUserAuthService {
    private _repository: IUserRepository
    private _crudValidator: RegisterUserValidator
    private _fileSaverService: IFileSaverService

    constructor(@Inject(InjectionKey.USER_REPOSITORY) repository: IUserRepository, @Inject(InjectionKey.USER_CRUD_VALIDATOR) crudValidator: RegisterUserValidator, @Inject(InjectionKey.FILE_SAVE_SERVICE) fileSaverService: IFileSaverService) {
        this._repository = repository
        this._crudValidator = crudValidator
        this._fileSaverService = fileSaverService
    }

    async registerUser(dto: RegisterUserDto): Promise<UserDto | null> {
        const validationResult = this._crudValidator.validateItem({...dto, profilePicUri: ""})
        if(validationResult.errors.length > 0) {
            throw new ValidationError("A validation error occured", validationResult.errors)
        }
        console.log(dto);
        
        const existingUser = await this._repository.findBy({ email: dto.email || "", pseudo: dto.pseudo || "" })
        if(existingUser) {
            throw new ResourceAlreadyExistError({ message: `A user with the email: ${dto.email} or the pseudo ${dto.pseudo} already exist` })
        }
        const filePath = `/files/imgs/avatars/${dto.pseudo}-${new Date().getUTCMilliseconds()}`
        this._fileSaverService.saveFileToPath(dto.avatar!, filePath)
        const result = (await this._repository.insert(userMapper.toEntity({...dto, profilePicUri: filePath})))!
        return userMapper.toDto(result)
    }
}