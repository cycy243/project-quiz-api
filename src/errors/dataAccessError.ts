export class DataAccessError extends Error {
    constructor(args: {
        message: String
    }) {
        super(args.message.toString())
    }
}