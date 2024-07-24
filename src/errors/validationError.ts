export class ValidationError extends Error {
    constructor(message: String, public errors: String[]) {
        super(message.toString())
    }
}