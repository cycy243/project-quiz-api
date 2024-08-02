import { File } from "koa-multer";
import IFileSaverService from "../iFileSaverService";
import { existsSync, writeFile } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import NonExistentPathError from "../errors/nonExistentPathError";
import PathAlreadyExistError from "../errors/pathalreadtExistError";

export default class LocalStorageFileSaver implements IFileSaverService {
    saveFileToPath(file: File, path: String): string {
        if(!existsSync(dirname(`${path}`))) {
            throw new NonExistentPathError(`There is no such directory as ${dirname(`${path}`)}`)
        }
        const fileName = basename(`${path}`);
        const fullPath = `${join(dirname(`${path}`), fileName.substring(fileName.lastIndexOf('.')))}.${extname(file.filename)}`
        if(existsSync(`${fullPath}`)) {
            throw new PathAlreadyExistError(`The path [${path}] already exists.`)
        }
        writeFile(`${fullPath}`, file.buffer, (err) => {
            if(err) {
                throw new Error((err as any).message)
            }            
        })
        return fullPath;
    }

}