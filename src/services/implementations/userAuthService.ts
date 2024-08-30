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
import * as bcrypt from 'bcrypt';
import { join, resolve } from "path";
import { IUser } from "../../models/user";
import NoUserFoundError from "../errors/noUserFoundError";
import { ConnectUserDto } from "../../dto/auth/connectUserDto";
import ITokenGenerator from "../utils/iTokenGenerator";

const HASH_SALT = 10;

@Service(InjectionKey.USER_SERVICE)
export default class UserAuthService implements IUserAuthService {
    private _repository: IUserRepository
    private _crudValidator: RegisterUserValidator
    private _fileSaverService: IFileSaverService
    private _tokenGenerator: ITokenGenerator

    constructor(@Inject(InjectionKey.USER_REPOSITORY) repository: IUserRepository, @Inject(InjectionKey.USER_CRUD_VALIDATOR) crudValidator: RegisterUserValidator, @Inject(InjectionKey.FILE_SAVE_SERVICE) fileSaverService: IFileSaverService, @Inject(InjectionKey.TOKEN_GENERATOR_SERVICE) tokenGenerator: ITokenGenerator) {
        this._repository = repository
        this._crudValidator = crudValidator
        this._fileSaverService = fileSaverService
        this._tokenGenerator = tokenGenerator
    }

    async registerUser(dto: RegisterUserDto): Promise<UserDto | null> {
        const validationResult = this._crudValidator.validateItem(dto)
        if(validationResult.errors.length > 0) {
            throw new ValidationError("A validation error occured", validationResult.errors)
        }
        
        const existingUser = await this._repository.findBy({ email: dto.email || "", pseudo: dto.pseudo || "" })
        if(existingUser) {
            throw new ResourceAlreadyExistError({ message: `A user with the email: ${dto.email} or the pseudo ${dto.pseudo} already exist` })
        }
        const filePath = resolve(`./public/files/imgs/avatars`)
        
        dto.password = bcrypt.hashSync(dto.password || "", HASH_SALT)
        const conversion = {...dto, profilePicUri: 'img/avatars/' + this._fileSaverService.saveFileToPath(dto.avatar!, filePath, `${dto.pseudo}-${new Date().getUTCMilliseconds()}`) }
        const result = (await this._repository.insert(userMapper.toEntity(conversion)))!
        return userMapper.toDto(result)
    }

    async connectUserWithLogin(dto: ConnectUserDto): Promise<UserDto | null> {
        if(!dto.login) {
            throw new ValidationError("A validation error occured", [ "User must provide a login" ]);
        }
        if(!dto.password) {
            throw new ValidationError("A validation error occured", [ "User must provide a password" ]);
        }
        const user: IUser | null = await this._repository.findBy({ email: dto.login, pseudo: dto.login });
        if(!user) {
            throw new NoUserFoundError("No user were found for the given mail or pseudo")
        }
        if(!bcrypt.compareSync(dto.password, user.password.toString())) {
            throw new NoUserFoundError("Wrong password")
        }
        
        let resultDto: UserDto = userMapper.toDto(user)
        return { ...resultDto, token: (await this._tokenGenerator.generateToken(resultDto))! }
    }
}