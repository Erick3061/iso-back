import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { TypeUser } from './enums/user.enum';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Auth(TypeUser.admin)
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    return this.userService.create(createUserDto, user);
  }

  @Get()
  @Auth(TypeUser.admin)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.userService.findAll(paginationDto, user.userName === 'admin' ? undefined : user);
  }

  @Get(':term')
  @Auth(TypeUser.admin)
  findOne(@Param('term') term: string) {
    return this.userService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(TypeUser.admin, TypeUser.user)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(TypeUser.admin)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.userService.remove(id, user);
  }
}
