import { File } from "koa-multer";

export default interface IFileSaverService {
    /**
     * Save the given file in a storage
     * 
     * @param file  file to save
     * 
     * @returns     True if the file has been correctly saved, otherwise false
     */
    saveFileToPath(file: File, path: String): boolean;
}