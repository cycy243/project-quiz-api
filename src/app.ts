import { Action, createExpressServer, useContainer, useExpressServer } from "routing-controllers";
import "reflect-metadata";
import Container from "typedi";
import { IUserRepository } from "./repository/iUserRepository";
import { UserRepository } from "./repository/mongo_repository/userRepository";
import User from "./models/user";
import IUserAuthService from "./services/iUserAuthService";
import UserAuthService from "./services/implementations/userAuthService";
import RegisterUserValidator from "./validator/registerUserValidator";
import { InjectionKey } from "./utils/injection_key";
import { HttpErrorHandler } from "./middlewares/errorsMiddleware";
import multer from "multer";
import IFileSaverService from "./services/iFileSaverService";
import LocalStorageFileSaver from "./services/implementations/localStorageFileSaver";
import ITokenGenerator from "./services/utils/iTokenGenerator";
import BearerTokenGenerator from "./services/utils/implementations/bearerTokenGenerator";
import { config } from './librairies/config';
import ITokenValidator from "./services/utils/iTokenValidator";
import BearerTokenValidator from "./services/utils/implementations/bearerTokenValidator";
import Quiz from "./models/quiz";
import IQuizRepository from "./repository/iQuizRepository";
import QuizRepository from "./repository/mongo_repository/quizRepository";

config();

const path = require('path');

const express = require('express');

Container.set<IUserRepository>(InjectionKey.USER_REPOSITORY, new UserRepository(User))
Container.set<IQuizRepository>(InjectionKey.QUIZ_REPOSITORY, new QuizRepository())
Container.set<RegisterUserValidator>(InjectionKey.USER_CRUD_VALIDATOR, new RegisterUserValidator())
Container.set<HttpErrorHandler>(InjectionKey.ERROR_MIDDLEWARE, new HttpErrorHandler())
Container.set<IFileSaverService>(InjectionKey.FILE_SAVE_SERVICE, new LocalStorageFileSaver())
Container.set<ITokenGenerator>(InjectionKey.TOKEN_GENERATOR_SERVICE, new BearerTokenGenerator(process.env.BEARER_TOKEN_AUDIENCE!, process.env.BEARER_TOKEN_ISSUER!, process.env.BEARER_TOKEN_VALIDITY!, process.env.BEARER_TOKEN_SECRET!));
Container.set<ITokenValidator>(InjectionKey.TOKEN_VALIDATOR_SERVICE, new BearerTokenValidator(process.env.BEARER_TOKEN_AUDIENCE!, process.env.BEARER_TOKEN_ISSUER!, process.env.BEARER_TOKEN_VALIDITY!, process.env.BEARER_TOKEN_SECRET!));
Container.set<IUserAuthService>(InjectionKey.USER_SERVICE, 
    new UserAuthService(Container.get<IUserRepository>(InjectionKey.USER_REPOSITORY), 
    Container.get<RegisterUserValidator>(InjectionKey.USER_CRUD_VALIDATOR), 
    Container.get<IFileSaverService>(InjectionKey.FILE_SAVE_SERVICE), 
    Container.get<ITokenGenerator>(InjectionKey.TOKEN_GENERATOR_SERVICE))
)

useContainer(Container)

const app = express()

useExpressServer(app, {
    authorizationChecker: async (action: Action, roles: string[]) => {
        // Validate that the user has the right to access the route
        const validator = await Container.get<ITokenValidator>(InjectionKey.TOKEN_VALIDATOR_SERVICE);
        const token = action.request.headers['authorization'].split(' ')[1];
        console.log(`User token : ${token}`);
        const tokenIsValid = await validator.isValidToken(token, roles);
        console.log(`User token is valid: ${tokenIsValid}`);
        return tokenIsValid;
    },
    cors: true,
    defaultErrorHandler: false,
    middlewares: [path.join(__dirname + '/middlewares/*.ts')],
    controllers: [path.join(__dirname + '/controller/*.ts')], // and configure it the way you need (controllers, validation, etc.)
});

/**
 * if the '/files' isn't mentionned, the routeur will serve the files from the directory under the directory '/img'
 * We'll need to do '[server_ip]/img' even though we want to do '[server_ip]/files'
 */
app.use('/img', express.static(path.join(__dirname, '../public/files/imgs')))

module.exports = app