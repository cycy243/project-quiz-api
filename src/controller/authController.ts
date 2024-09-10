import { Body, Post, JsonController, UploadedFile, Get, Authorized } from 'routing-controllers';
import IUserAuthService from '../services/iUserAuthService';
import { Inject, Service } from 'typedi';
import { InjectionKey } from '../utils/injection_key';
import { File } from 'koa-multer';
import { UserDto } from '../dto/userDto';
import { RegisterUserDto } from '../dto/auth/registerUserDto';
import { ConnectUserDto } from '../dto/auth/connectUserDto';

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

  /**
   * Create a post route
   * 
   * @param user  users data
   * 
   * @returns     The connected user
   */
  @Post("/connect")
  async connectUser(@Body() user: ConnectUserDto) {
    return await this._service.connectUserWithLogin(user);
  }

  @Authorized()
  @Get('/authorized_request')
  unaGetto() {
    return "Hello World";
  }

  @Authorized('ADMIN')
  @Get('/authorized_admin_request')
  unaGettoAdmin() {
    return "Hello World";
  }
}