import { File } from "koa-multer";
import IFileSaverService from "../iFileSaverService";
import { writeFile } from "fs";

export default class LocalStorageFileSaver implements IFileSaverService {
    saveFileToPath(file: File, path: String): boolean {
        const toPath = path.startsWith("/") ? path : "/" + path
        writeFile("/files/imgs" + toPath, file.buffer, (err) => {
            throw new Error((err as Error).message)
        })
        return true;
    }

}