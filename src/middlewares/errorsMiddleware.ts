import { isInstance } from "class-validator";
import { NextFunction, Response, Request } from "express";
import { ValidationError } from "../errors/validationError";
import ResourceAlreadyExistError from "../errors/resourceAlreadyExistError";
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { InjectionKey } from "../utils/injection_key";
import NoUserFoundError from "../services/errors/noUserFoundError";

class ApiError {
    constructor(
        public code: number,
        public title: String,
        public message: String,
        public errors: String[] = []
    ) {}
}

@Service()
@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        let apiError = new ApiError(400, "Server error", "An unexpected error occured")
        if(error instanceof ValidationError) {
            apiError = new ApiError(400, "Validation errors", "One or more validation error occured", (error as ValidationError).errors)
        } else if(error instanceof ResourceAlreadyExistError) {
            apiError = new ApiError(409, "Conflict detected", error.message)
        } else if(error instanceof NoUserFoundError) {
            apiError = new ApiError(404, "No user found", "The given user wasn't found")
        }
        response.status(apiError.code).send(apiError)
        next(error);
    }
}