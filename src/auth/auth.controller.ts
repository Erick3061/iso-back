import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { TypeUser } from 'src/user/enums/user.enum';
import { GetUser, RoleProtected, Auth } from './decorators/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  getPrivate(@GetUser() user: User) {
    return user
  }

  @Get('private2')
  @RoleProtected(TypeUser.admin, TypeUser.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  getPrivate2(@GetUser() user: User) {
    return user
  }

  @Get('private3')
  @Auth(TypeUser.admin)
  getPrivate3(@GetUser() user: User) {
    return user
  }

  @Get('check')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

}
