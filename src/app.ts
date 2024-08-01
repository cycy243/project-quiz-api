import { useContainer, useExpressServer } from "routing-controllers";
import "reflect-metadata";
import Container from "typedi";
import { IUserRepository } from "./repository/iUserRepository";
import { UserRepository } from "./repository/mongo_repository/userRepository";
import User from "./models/user";
import IUserAuthService from "./services/iUserService";
import UserAuthService from "./services/implementations/userAuthService";
import UserCUValidator from "./validator/userCUValidator";
import { InjectionKey } from "./utils/injection_key";
import { HttpErrorHandler } from "./middlewares/errorsMiddleware";
import multer from "multer";
import IFileSaverService from "./services/IfileSaverService";
import LocalStorageFileServer from "./services/implementations/localStorageFileSaver";

const path = require('path');

const express = require('express');

const app = express();

Container.set<IUserRepository>(InjectionKey.USER_REPOSITORY, new UserRepository(User))
Container.set<UserCUValidator>(InjectionKey.USER_CRUD_VALIDATOR, new UserCUValidator())
Container.set<HttpErrorHandler>(InjectionKey.ERROR_MIDDLEWARE, new HttpErrorHandler())
Container.set<IFileSaverService>(InjectionKey.FILE_SAVE_SERVICE, new LocalStorageFileServer())
Container.set<IUserAuthService>(InjectionKey.USER_SERVICE, 
    new UserAuthService(Container.get<IUserRepository>(InjectionKey.USER_REPOSITORY), Container.get<UserCUValidator>(InjectionKey.USER_CRUD_VALIDATOR), Container.get<IFileSaverService>(InjectionKey.FILE_SAVE_SERVICE))
)

useContainer(Container)

useExpressServer(app, {
    cors: true,
    defaultErrorHandler: false,
    middlewares: [path.join(__dirname + '/middlewares/*.ts')],
    // register created express server in routing-controllers
    controllers: [path.join(__dirname + '/controller/*.ts')], // and configure it the way you need (controllers, validation, etc.)
});

module.exports = app