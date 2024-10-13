import { mock, Mock } from "ts-jest-mocker"
import { IUserRepository } from "../../src/repository/iUserRepository"
import IUserAuthService from "../../src/services/iUserAuthService"
import UserAuthService from "../../src/services/implementations/userAuthService"
import { DataAccessError } from "../../src/errors/dataAccessError"
import RegisterUserValidator from "../../src/validator/registerUserValidator"
import IFileSaverService from "../../src/services/iFileSaverService"
import multer from "koa-multer"
import { UserDto } from "../../src/dto/userDto"
import { ConnectUserDto } from "../../src/dto/auth/connectUserDto"
import NoUserFoundError from "../../src/services/errors/noUserFoundError"
import { ValidationError } from "../../src/errors/validationError"
import bcrypt from "bcrypt"
import ITokenGenerator from "../../src/services/utils/iTokenGenerator"

const HASH_SALT = 10;

describe("UserAuthServiceTests", () => {
    let _mockedUserRepository: Mock<IUserRepository>
    let _mockedFileSaverService: Mock<IFileSaverService>
    let _mockedTokenGenerator: Mock<ITokenGenerator>
    let _userService: IUserAuthService

    beforeEach(() => {
        _mockedUserRepository = mock<IUserRepository>()
        _mockedFileSaverService = mock<IFileSaverService>()
        _mockedTokenGenerator = mock<ITokenGenerator>()

        _mockedUserRepository.findBy.mockResolvedValueOnce({
            name: "Testkkhjkh",
            password: "Password123$",
            email: "test@mail.com",
            birthDate: new Date('2002-12-15'),
            pseudo: "test",
            bio: "tesklkjt",
            firstname: "testhjkhjgk",
            profilePicUri: ""
        })

        _mockedFileSaverService.saveFileToPath.mockReturnValue("file.png")

        _mockedTokenGenerator.generateToken.mockReturnValue(Promise.resolve(""))

        _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)
    })

    describe("Register user with mail", () => {
        describe("when repo throws exceptions then let it slip", () => {
            it("when repo throw DataAccess Exception then service doesn't catch it", async () => {
                _mockedUserRepository = mock<IUserRepository>()
        
                _mockedUserRepository.insert.mockImplementation(() => {
                    throw new DataAccessError({ message: "A throwing test" })
                })

                _mockedUserRepository.findBy.mockResolvedValueOnce(null)
        
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                try {
                    await _userService.registerUser({
                        name: "Testkkhjkh",
                        password: "Password123$",
                        email: "test@mail.com",
                        birthDate: '2002-12-15',
                        pseudo: "test",
                        bio: "tesklkjt",
                        firstname: "testhjkhjgk",
                        avatar: { originalname: "file.jpg", filename: "file.jpg", mimetype: "image/jpg" } as multer.File
                    })
                    fail()
                } catch(error) {                
                    expect(error instanceof DataAccessError).toBeTruthy()
                }
            })
        })

        describe("Connect user with mail", () => {
            let user: ConnectUserDto;

            beforeEach(() => {
                _mockedUserRepository = mock<IUserRepository>()
                user = {
                    login: "Testkkhjkh",
                    password: "Password123$"
                };
            })

            it("When no user found throw error", async () => {
                _mockedUserRepository.findBy.mockResolvedValueOnce(null)
        
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                try {
                    await _userService.connectUserWithLogin(user!)
                    fail()
                } catch(error) {                
                    expect(error instanceof NoUserFoundError).toBeTruthy()
                }
            })

            it("When no password pass then throw error", async () => {
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                try {
                    await _userService.connectUserWithLogin({ ...user, password: null })
                    fail()
                } catch(error) {                
                    expect(error instanceof ValidationError).toBeTruthy()
                }
            })

            it("When no login pass then throw error", async () => {
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                try {
                    await _userService.connectUserWithLogin({ ...user, login: null })
                    fail()
                } catch(error) {                
                    expect(error instanceof ValidationError).toBeTruthy()
                }
            })

            it("When a user is found but the passwords doesn't match then throw error", async () => {
                _mockedUserRepository.findBy.mockResolvedValueOnce({
                    name: "Testkkhjkh",
                    email: "test@mail.com",
                    birthDate: new Date('15/12/2002'),
                    pseudo: "test",
                    bio: "tesklkjt",
                    firstname: "testhjkhjgk",
                    password: new String(bcrypt.hashSync("Password123", HASH_SALT)),
                    profilePicUri: ""
                })
        
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                try {
                    await _userService.connectUserWithLogin(user!)
                    fail()
                } catch(error) {                
                    expect(error instanceof NoUserFoundError).toBeTruthy()
                    expect((error as Error).message).toBe("Wrong password")
                }
            })

            it("When a user is found but the passwords match then return dto with token",  async () => {
                _mockedUserRepository.findBy.mockResolvedValueOnce({
                    name: "Testkkhjkh",
                    email: "test@mail.com",
                    birthDate: new Date('2002-12-15'),
                    pseudo: "test",
                    bio: "tesklkjt",
                    firstname: "testhjkhjgk",
                    password: new String(bcrypt.hashSync("Password123$", HASH_SALT)),
                    profilePicUri: ""
                })
                _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService, _mockedTokenGenerator)

                expect((await _userService.connectUserWithLogin(user!))?.email).toBe("test@mail.com")
            })
        })
    })
})