import { mock, Mock } from "ts-jest-mocker"
import { IUserRepository } from "../../src/repository/iUserRepository"
import IUserService from "../../src/services/iUserService"
import UserService from "../../src/services/implementations/userService"
import { DataAccessError } from "../../src/errors/dataAccessError"
import UserCUValidator from "../../src/validator/userCUValidator"
import { rejects } from "assert"
import { ValidationError } from "../../src/errors/validationError"

describe("UserServiceTests", () => {
    let _mockedUserRepository: Mock<IUserRepository>
    let _userService: IUserService

    beforeEach(() => {
        _mockedUserRepository = mock<IUserRepository>()

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

        _userService = new UserService(_mockedUserRepository, new UserCUValidator())
    })

    describe("when repo throws exceptions then let it slip", () => {
        it("when repo throw DataAccess Exception then service doesn't catch it", async () => {
            _mockedUserRepository = mock<IUserRepository>()
    
            _mockedUserRepository.insert.mockImplementation(() => {
                throw new DataAccessError({ message: "A throwing test" })
            })

            _mockedUserRepository.findBy.mockResolvedValueOnce(null)
    
            _userService = new UserService(_mockedUserRepository, new UserCUValidator())

            try {
                await _userService.addUser({
                    name: "Testkkhjkh",
                    password: "Password123$",
                    email: "test@mail.com",
                    birthDate: new Date('15/12/2002'),
                    pseudo: "test",
                    bio: "tesklkjt",
                    firstname: "testhjkhjgk",
                    profilePicUri: ""
                })
                fail()
            } catch(error) {
                expect(error instanceof DataAccessError).toBeTruthy()
            }
        })
    })
})