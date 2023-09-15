import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export const ValidDate = (validationOptions?: ValidationOptions) => {
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
    dayjs.extend(customParseFormat);
    if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) return false;
    return true;
}