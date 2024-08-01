import multer from "koa-multer";
import IFileSaverService from "../../src/services/iFileSaverService"
import LocalStorageFileSaver from "../../src/services/implementations/localStorageFileSaver"
import fs from 'node:fs';
import path from "node:path";

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
            _fileSaverService.saveFileToPath({ buffer: Buffer.from(data), originalname: "test.svg",  } as multer.File, testFilesFolderPath + '/test_result_file.svg')
            await sleep(1000)
            expect(fs.existsSync(testFilesFolderPath + "/test_result_file.svg")).toBeTruthy()
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
        .filter((filePath: string) => isFile(filePath) && path.basename(filePath).startsWith('test_result'));
    testFolderFiles.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
    })
}