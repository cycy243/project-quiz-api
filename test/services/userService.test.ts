import { mock, Mock } from "ts-jest-mocker"
import { IUserRepository } from "../../src/repository/iUserRepository"
import IUserAuthService from "../../src/services/iUserAuthService"
import UserAuthService from "../../src/services/implementations/userAuthService"
import { DataAccessError } from "../../src/errors/dataAccessError"
import RegisterUserValidator from "../../src/validator/registerUserValidator"
import IFileSaverService from "../../src/services/iFileSaverService"

describe("UserServiceTests", () => {
    let _mockedUserRepository: Mock<IUserRepository>
    let _mockedFileSaverService: Mock<IFileSaverService>
    let _userService: IUserAuthService

    beforeEach(() => {
        _mockedUserRepository = mock<IUserRepository>()
        _mockedFileSaverService = mock<IFileSaverService>()

        _mockedUserRepository.findBy.mockResolvedValueOnce({
            name: "Testkkhjkh",
            password: "Password123$",
            email: "test@mail.com",
            birthDate: new Date('15/12/2002'),
            pseudo: "test",
            bio: "tesklkjt",
            firstname: "testhjkhjgk",
            profilePicUri: ""
        })

        _mockedFileSaverService.saveFileToPath.mockReturnValue("file.png")

        _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService)
    })

    describe("when repo throws exceptions then let it slip", () => {
        it("when repo throw DataAccess Exception then service doesn't catch it", async () => {
            _mockedUserRepository = mock<IUserRepository>()
    
            _mockedUserRepository.insert.mockImplementation(() => {
                throw new DataAccessError({ message: "A throwing test" })
            })

            _mockedUserRepository.findBy.mockResolvedValueOnce(null)
    
            _userService = new UserAuthService(_mockedUserRepository, new RegisterUserValidator(), _mockedFileSaverService)

            try {
                await _userService.registerUser({
                    name: "Testkkhjkh",
                    password: "Password123$",
                    email: "test@mail.com",
                    birthDate: '15/12/2002',
                    pseudo: "test",
                    bio: "tesklkjt",
                    firstname: "testhjkhjgk",
                    avatar: null
                })
                fail()
            } catch(error) {                
                expect(error instanceof DataAccessError).toBeTruthy()
            }
        })
    })
})