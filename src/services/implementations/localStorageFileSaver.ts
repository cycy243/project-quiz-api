import { File } from "koa-multer";
import IFileSaverService from "../iFileSaverService";
import { existsSync, writeFile } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import NonExistentPathError from "../errors/nonExistentPathError";
import PathAlreadyExistError from "../errors/pathalreadtExistError";

export default class LocalStorageFileSaver implements IFileSaverService {
    saveFileToPath(file: File, path: string): string {
        if(!existsSync(dirname(path))) {
            throw new NonExistentPathError(`There is no such directory as ${dirname(path)}`)
        }
        const fullPath = this.generatePathFile(file, path)
        if(existsSync(`${fullPath}`)) {
            throw new PathAlreadyExistError(`The path [${path}] already exists.`)
        }
        writeFile(fullPath, file.buffer, (err) => {
            if(err) {
                throw new Error((err as any).message)
            }            
        })
        return fullPath;
    }

    private generatePathFile(file: File, path: string): string {
        const fileName = basename(`${path}`);
        return `${join(dirname(`${path}`), fileName.substring(0, fileName.lastIndexOf('.')))}${extname(file.filename)}`
    }

}