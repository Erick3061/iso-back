import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {

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

}