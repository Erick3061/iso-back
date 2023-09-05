import { IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TypeUser } from "../enums/user.enum";

export class CreateUserDto {

    @IsString()
    @MinLength(5)
    fullName: string;

    @IsString()
    @MinLength(5)
    userName: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;

    @IsOptional()
    @IsIn(['user', 'admin'])
    role?: TypeUser;

}
