import { File } from "koa-multer";
import IFileSaverService from "../iFileSaverService";
import { existsSync, writeFile } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import NonExistentPathError from "../errors/nonExistentPathError";
import PathAlreadyExistError from "../errors/pathalreadtExistError";

export default class LocalStorageFileSaver implements IFileSaverService {
    saveFileToPath(file: File, path: string, filename: string): string {
        if(!existsSync(path)) {
            throw new NonExistentPathError(`There is no such directory as ${path}`)
        }
        const fullPath = this.generatePathFile(file, path, filename)
        if(existsSync(`${fullPath}`)) {
            throw new PathAlreadyExistError(`The path [${path}] already exists.`)
        }
        writeFile(fullPath, file.buffer, (err) => {
            if(err) {
                throw new Error((err as any).message)
            }            
        })
        return basename(fullPath);
    }

    private generatePathFile(file: File, path: string, filename: string): string {
        return resolve(path, `${filename}${extname(file.originalname)}`)
    }

}