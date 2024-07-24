import { Controller, Param, Body, Get, Post, Put, Delete, JsonController } from 'routing-controllers';
import IUserService from '../services/iUserService';
import { Inject, Service } from 'typedi';
import { UserDto } from '../dto/userDto';
import { InjectionKey } from '../utils/injection_key';

@Service()
@JsonController('/users')
export class UserController {
    private _service: IUserService

    constructor(@Inject(InjectionKey.USER_SERVICE) service: IUserService) {
        this._service = service
    }

  @Get('')
  getAll() {
    return 'This action returns all users';
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return 'This action returns user #' + id;
  }

  @Post('')
  async post(@Body() user: UserDto) {
    return await this._service.addUser(user);
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}