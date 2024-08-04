import multer from "koa-multer";
import { RegisterUserDto } from "../../src/dto/auth/registerUserDto"
import { UserDto } from "../../src/dto/userDto"
import RegisterUserValidator from "../../src/validator/registerUserValidator"
import fs from 'node:fs';
import path, { resolve } from "node:path";

describe("UserCrudValidator", () => {
    let validator: RegisterUserValidator
    let dto: RegisterUserDto

    beforeAll(() => {
        deleteTestsFiles()
    })

    afterEach(() => {
        deleteTestsFiles()
    })

    beforeEach(() => {
        const filePath = testFilesFolderPath + '/file.jpg'
        const data = fs.readFileSync(filePath, 'utf8');
        validator = new RegisterUserValidator()
        dto = {
            name: "Testkkhjkh",
            password: "Password123$",
            email: "test@mail.com",
            birthDate: '15/12/2002',
            pseudo: "test",
            bio: "tesklkjt",
            firstname: "testhjkhjgk",
            avatar: { buffer: Buffer.from(data), originalname: "file.jpg", filename: "file.jpg", mimetype: "image/jpg" } as multer.File
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

const isFile = (fileName: string) => {
    return fs.lstatSync(fileName).isFile();
};

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const testFilesFolderPath = process.cwd() + '/test/files'

function deleteTestsFiles() {
    const testFolderFiles = fs.readdirSync(testFilesFolderPath)
        .map((fileName: string) => {
          return path.join(testFilesFolderPath, fileName);
        })
        .filter((filePath: string) => path.basename(filePath).startsWith('test_result'));
    testFolderFiles.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
    })
}