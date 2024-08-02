import { config } from './config';

config();

export const getFilesRootFolder = () => {
    return `${process.env.HOST}:${process.env.PORT}`
}