import { ValidationOptions, ValidationArguments, registerDecorator } from "class-validator"

export const ValidDateTime = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: { validate }
        })
    }
}

const validate = (value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> => {
    const dayjs = require('dayjs');
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    // const timeZone = require('dayjs/plugin/timezone');
    dayjs.extend(customParseFormat);
    // dayjs.extend(timeZone);
    if (!dayjs(value, 'YYYY-MM-DD HH:mm', true).isValid()) return false;
    return true;
}