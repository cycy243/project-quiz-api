import { Body, Post, JsonController, UploadedFile } from 'routing-controllers';
import IUserService from '../services/iUserService';
import { Inject, Service } from 'typedi';
import { InjectionKey } from '../utils/injection_key';
import { File } from 'koa-multer';
import { UserDto } from '../dto/userDto';

@Service()
@JsonController('/auth')
export class AuthController {
    private _service: IUserService

    constructor(@Inject(InjectionKey.USER_SERVICE) service: IUserService) {
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
  async register(@UploadedFile('file') file: File, @Body() user: UserDto) {       
    return await this._service.addUser(user);
  }
}