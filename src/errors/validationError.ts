export class ValidationError extends Error {
    constructor(message: String, private errors: String[]) {
        super(message.toString())
    }
}