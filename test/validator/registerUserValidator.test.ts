import { RegisterUserDto } from "../../src/dto/auth/registerUserDto"
import { UserDto } from "../../src/dto/userDto"
import RegisterUserValidator from "../../src/validator/registerUserValidator"

describe("UserCrudValidator", () => {
    let validator: RegisterUserValidator
    let dto: RegisterUserDto

    beforeEach(() => {
        validator = new RegisterUserValidator()
        dto = {
            name: "Testkkhjkh",
            password: "Password123$",
            email: "test@mail.com",
            birthDate: '15/12/2002',
            pseudo: "test",
            bio: "tesklkjt",
            firstname: "testhjkhjgk",
            avatar: null
        }
    })

    describe("Valid user cases", () => {
        it("All user information are valid", () => {
            const result = validator.validateItem(dto)

            expect(result.isSuccess).toBeTruthy()
        })
    })

    describe("Invalid cases", () => {
        describe("[name] invalid", () => {
            it("[name] is null then result isn't success", () => {
                dto.name = null

                const result = validator.validateItem(dto)

                expect(result.isSuccess).toBeFalsy()
            })
        })

        describe("[password] invalid", () => {
            it("[password] with no upper case letter", () => {
                dto.password = "password123$"

                const result = validator.validateItem(dto)

                expect(result.isSuccess).toBeFalsy()
            })
        })
    })
})