import { useContainer, useExpressServer } from "routing-controllers";
import { UserController } from "./controller/authController";
import "reflect-metadata";
import Container from "typedi";
import { IUserRepository } from "./repository/iUserRepository";
import { UserRepository } from "./repository/mongo_repository/userRepository";
import User from "./models/user";
import IUserService from "./services/iUserService";
import UserService from "./services/implementations/userService";

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

Container.set<IUserRepository>('user-repo', new UserRepository(User))
Container.set<IUserService>('user-service', new UserService(Container.get('user-repo')))

useExpressServer(app, {
    // register created express server in routing-controllers
    controllers: [path.join(__dirname + '/controller/*.ts')], // and configure it the way you need (controllers, validation, etc.)
});

useContainer(Container)

module.exports = app