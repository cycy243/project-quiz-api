import multer from "koa-multer";
import IFileSaverService from "../../src/services/iFileSaverService"
import LocalStorageFileSaver from "../../src/services/implementations/localStorageFileSaver"
import fs from 'node:fs';
import path, { resolve } from "node:path";
import NonExistentPathError from "../../src/services/errors/nonExistentPathError";
import PathAlreadyExistError from "../../src/services/errors/pathalreadtExistError";

describe("LocalStorageFileServerTests", () => {
    let _fileSaverService: IFileSaverService

    beforeAll(() => {
        deleteTestsFiles()
    })

    beforeEach(() => {
        _fileSaverService = new LocalStorageFileSaver()
    })

    afterEach(() => {
        deleteTestsFiles()
    })

    describe('save a file', () => {
        it('when path exist then save file', async () => {
            const filePath = testFilesFolderPath + '/file.svg'
            const data = fs.readFileSync(filePath, 'utf8');
            expect(_fileSaverService.saveFileToPath({ buffer: Buffer.from(data), originalname: "test.svg", filename: "test.svg" } as multer.File, testFilesFolderPath, 'test_result_file')).toBe('test_result_file.svg')
            await sleep(1000)
            expect(fs.existsSync(testFilesFolderPath + "/test_result_file.svg")).toBeTruthy()
        })
    })

    describe('error scenarii', () => {
        it('when destination directory doesn\'t exist then throw Error', () => {
            try {                
                const filePath = testFilesFolderPath + '/file.svg'
                const data = fs.readFileSync(filePath, 'utf8');
                _fileSaverService.saveFileToPath({ buffer: Buffer.from(data), originalname: "test.svg",  } as multer.File, testFilesFolderPath + '/unknow_dir', 'test_result_file')
                expect(true).toBeFalsy()
            } catch(error) {
                expect(error instanceof NonExistentPathError).toBeTruthy()
            }
        })

        it('when destination directory doesn\'t exist then throw Error', () => {
            try {                
                const filePath = testFilesFolderPath + '/file.svg'
                const data = fs.readFileSync(filePath, 'utf8');
                _fileSaverService.saveFileToPath({ buffer: Buffer.from(data), originalname: "test.svg", filename: "test.svg"  } as multer.File, testFilesFolderPath, 'file')
                expect(true).toBeFalsy()
            } catch(error) {
                
                expect(error instanceof PathAlreadyExistError).toBeTruthy()
            }
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