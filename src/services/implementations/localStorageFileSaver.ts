import { File } from "koa-multer";
import IFileSaverService from "../iFileSaverService";
import { writeFile } from "fs";

export default class LocalStorageFileSaver implements IFileSaverService {
    saveFileToPath(file: File, path: String): boolean {
        writeFile(`${path}`, file.buffer, (err) => {
            if(err) {
                throw new Error((err as any).message)
            }            
        })
        return true;
    }

}