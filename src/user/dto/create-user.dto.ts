import { IsArray, IsBoolean, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
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
    @Matches(
        /(^[A-Za-z\d$@$!%*?&]+$)/, {
        message: 'The password do not have a spaces'
    })
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsIn(['user', 'admin'])
    role?: TypeUser;

}
