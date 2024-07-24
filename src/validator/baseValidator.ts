import { ValidationErrors, Validator } from "fluentvalidation-ts";

export type ValidationResult = {
    isSuccess: boolean
    errors: String[]
}

export class BaseValidator<T> extends Validator<T> {
    constructor() {
        super();
    }

    validateItem(value: T): ValidationResult {
        const validationResult = this.validate(value)
        const errors = Object.values(validationResult).filter(value => value !== null &&  value !== undefined).map(error => `${error}`)
        return { isSuccess: errors.length === 0, errors: errors };
    }
}