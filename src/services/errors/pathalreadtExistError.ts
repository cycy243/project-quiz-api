import ServiceError from "./serviceErrors";

export default class PathAlreadyExistError extends ServiceError {
    constructor(public message: string) {
        super(message)
    }
}