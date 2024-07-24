import { useContainer, useExpressServer } from "routing-controllers";
import { UserController } from "./controller/authController";
import "reflect-metadata";
import Container from "typedi";
import { IUserRepository } from "./repository/iUserRepository";
import { UserRepository } from "./repository/mongo_repository/userRepository";
import User from "./models/user";
import IUserService from "./services/iUserService";
import UserService from "./services/implementations/userService";
import { Validator } from "fluentvalidation-ts";
import { UserDto } from "./dto/userDto";
import UserCUValidator from "./validator/userCUValidator";
import { InjectionKey } from "./utils/injection_key";

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

Container.set<IUserRepository>(InjectionKey.USER_REPOSITORY, new UserRepository(User))
Container.set<UserCUValidator>(InjectionKey.USER_CRUD_VALIDATOR, new UserCUValidator())
Container.set<IUserService>(InjectionKey.USER_SERVICE, UserService)

useExpressServer(app, {
    // register created express server in routing-controllers
    controllers: [path.join(__dirname + '/controller/*.ts')], // and configure it the way you need (controllers, validation, etc.)
});

useContainer(Container)

module.exports = app