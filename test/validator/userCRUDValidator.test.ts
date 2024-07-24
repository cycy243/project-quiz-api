import { UserDto } from "../../src/dto/userDto"
import UserCUValidator from "../../src/validator/userCUValidator"

describe("UserCrudValidator", () => {
    let validator: UserCUValidator
    let dto: UserDto

    beforeEach(() => {
        validator = new UserCUValidator()
        dto = {
            name: "Testkkhjkh",
            password: "Password123$",
            email: "test@mail.com",
            birthDate: '15/12/2002',
            pseudo: "test",
            bio: "tesklkjt",
            firstname: "testhjkhjgk",
            profilePicUri: ""
        }
    })

    describe("Valid user cases", () => {
        it("All user information are valid", () => {
            const result = validator.validateItem(dto)

            console.info(result)

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