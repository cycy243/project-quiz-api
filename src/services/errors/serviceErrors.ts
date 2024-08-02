export default class ServiceError extends Error {
    constructor(public message: string) {
        super(message)
    }
}