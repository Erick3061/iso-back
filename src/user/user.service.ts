import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user)
      delete user.password;

      return user;

    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {

      const { limit = 10, offset = 0 } = paginationDto;

      const users = (await this.userRepository.find({
        take: limit,
        skip: offset
      })).map(user => {
        delete user.password;
        return user;
      });
      return users;
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(term: string, msgError?: string) {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      user = await this.userRepository.findOneBy({ userName: term });
    }
    if (!user) throw (msgError) ? new UnauthorizedException(msgError) : new NotFoundException(`user with ${term} not found`);
    return user;
  }

  async findOnePlain(term: string, msgError?: string) {
    const user = await this.findOne(term, msgError);
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) throw new NotFoundException(`user with id: ${id} not found`);
    try {
      await this.userRepository.save(user);
      delete user.password;
      return user
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.userRepository.remove(product);
    return true
  }

  private handleError(error: any): never {
    if (error.code === 'SQLITE_CONSTRAINT') throw new BadRequestException(`UNIQUE constraint failed: userName`);
    console.log(error)
    throw new InternalServerErrorException('Check server logs');
  }
}
