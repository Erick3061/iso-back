import { IsString } from "class-validator";
import { ValidDate } from "../decorators/validation/valid-date.decorator";

export class DateDto {
    @IsString()
    @ValidDate({ message: 'start must be a Valid Date: [ YYYY-MM-DD ]' })
    start: string;

    @IsString()
    @ValidDate({ message: 'end must be a Valid Date: [ YYYY-MM-DD ]' })
    end: string;
}