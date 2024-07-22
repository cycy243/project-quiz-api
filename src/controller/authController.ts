import { Controller, Param, Body, Get, Post, Put, Delete, JsonController } from 'routing-controllers';
import IUserService from '../services/iUserService';
import { Inject, Service } from 'typedi';
import { UserDto } from '../dto/userDto';

@Service()
@JsonController()
export class UserController {
    private _service: IUserService

    constructor(@Inject('user-service') service: IUserService) {
        this._service = service
    }

  @Get('/users')
  getAll() {
    return 'This action returns all users';
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return 'This action returns user #' + id;
  }

  @Post('/users')
  async post(@Body() user: any) {
    await this._service.addUser({
        name: "",
        password: "",
        email: "",
        birthDate: new Date(),
        pseudo: "",
        bio: "",
        firstname: "",
        profilePicUri: ""
    })
    return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}