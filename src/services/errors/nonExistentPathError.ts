import ServiceError from "./serviceErrors";

export default class NonExistentPathError extends ServiceError {
    constructor(public message: string) {
        super(message)
    }
}