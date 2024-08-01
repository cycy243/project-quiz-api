import { Body, Post, JsonController, UploadedFile } from 'routing-controllers';
import IUserAuthService from '../services/iUserAuthService';
import { Inject, Service } from 'typedi';
import { InjectionKey } from '../utils/injection_key';
import { File } from 'koa-multer';
import { UserDto } from '../dto/userDto';
import { RegisterUserDto } from '../dto/auth/registerUserDto';

@Service()
@JsonController('/auth')
export class AuthController {
    private _service: IUserAuthService

    constructor(@Inject(InjectionKey.USER_SERVICE) service: IUserAuthService) {
        this._service = service
    }

    /**
     * Create a post route
     * 
     * @param file  File to upload (we get the file with the "UploadedFile" annotation and it is put in the file variable)
     * @param user  users data
     * 
     * @returns     The registered user
     */
  @Post()
  async register(@UploadedFile('file') file: File, @Body() user: RegisterUserDto) {
    return await this._service.registerUser({ ...user, avatar: file});
  }
}