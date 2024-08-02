import { File } from "koa-multer";

export default interface IFileSaverService {
    /**
     * Save the given file in a storage
     * 
     * @param file  file to save
     * 
     * @returns     The filename pf the file if the file has been correctly saved
     */
    saveFileToPath(file: File, path: string, filename: string): string;
}