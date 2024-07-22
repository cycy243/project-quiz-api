export default class ResourceAlreadyExistError extends Error {
    constructor(args: { message: String }) {
        super(args.message.toString())
    }
}