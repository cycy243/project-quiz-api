import ServiceError from "./serviceErrors";

export default class NoUserFoundError extends ServiceError {
    constructor(public message: string) {
        super(message)
    }
}