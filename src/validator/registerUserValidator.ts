import { Validator } from "fluentvalidation-ts";
import { UserDto } from "../dto/userDto";
import { BaseValidator } from "./baseValidator";
import { Service } from "typedi";
import { InjectionKey } from "../utils/injection_key";
import { RegisterUserDto } from "../dto/auth/registerUserDto";
import multer from "koa-multer";

const VALID_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg']
const MAX_SIZE = 1024 * 1024 * 20

/**
 * A validator for validating user dto for update and create operation.
 */
@Service(InjectionKey.USER_CRUD_VALIDATOR)
export default class RegisterUserValidator extends BaseValidator<RegisterUserDto> {
    constructor() {
        super();

        this.ruleFor('email')
            .notEmpty().withMessage("The email is required")
            .emailAddress().withMessage("The email should be a valid email");
        this.ruleFor("bio")
            .notEmpty().withMessage("The bio is required")
            .minLength(5).withMessage("The bio should have a minimum length of 5")
            .maxLength(255).withMessage("The bio should have a maximum length of 255");
        this.ruleFor("birthDate")
            .notNull().withMessage("The birthdate is required")
            .must(date => Math.abs(new Date().getTime() - ((date ? new Date(date) : new Date()).getTime() || 0)) / (1000 * 60 * 60 * 24 * 365.25) >= 13).withMessage("The user should be 13 years old to register");
        this.ruleFor("firstname")
            .notEmpty().withMessage("The firstname is required")
            .minLength(5).withMessage("The firstname should have a minimum length of 5");
        this.ruleFor("name")
            .notEmpty().withMessage("The name is required")
            .notNull().withMessage("The name is required")
            .minLength(5).withMessage("The name should have a minimum length of 5");
        this.ruleFor("password")
            .notEmpty().withMessage("The password is required")
            .minLength(10).withMessage("The password should have a minimum length of 10")
            .must((pwd: string | null | undefined) => /([A-Z]+)/.test(pwd!)).withMessage("The password has to have at least one uppercase letter")
            .must((pwd: string | null | undefined) => /[a-z]{4,}/.test(pwd!)).withMessage("The password has to have at least four lowercase letters")
            .must((pwd: string | null | undefined) => /\W+/.test(pwd!)).withMessage("The password has to have at least one special caracter")
            .must((pwd: string | null | undefined) => /[0-9]+/.test(pwd!)).withMessage("The password has to have at least one number");
        this.ruleFor('avatar')
            .notNull().withMessage("User must have an avatar")
            .must((value: multer.File | null | undefined) => {
                // Validation of the type of the avatar img
                return VALID_FILE_TYPES.includes(value?.mimetype || '')
            })
            .must((value: multer.File | null | undefined) => {
                // Validation of the size of the avatar img
                return (value?.size || 0) <= MAX_SIZE
            })
    }
}