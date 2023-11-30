import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ValidDateTime } from '../decorators/validation';

export class DateTimeDto {
    @IsString()
    @ValidDateTime({ message: 'start must be a Valid Date: [ YYYY-MM-DD H:mm]' })
    start: string;

    @IsString()
    @ValidDateTime({ message: 'start must be a Valid Date: [ YYYY-MM-DD H:mm]' })
    end: string;
}