import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.logger = new Logger('userRepository');
  }

  async create(createUserDto: CreateUserDto, user?: User) {
    try {

      const { password, ...userData } = createUserDto;

      const userToCreate = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        user
      });

      await this.userRepository.save(userToCreate)
      delete userToCreate.password;

      return userToCreate;

    } catch (error) {
      console.log();

      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user?: User) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const users = (await this.userRepository.find({
        take: limit,
        skip: offset,
        where: {
          user: user ? {
            id: user.id
          } : {}
        }
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
    if (updateUserDto.password) updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
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

  async remove(id: string, admin: User) {
    try {
      const userFind = await this.findOne(id);
      if (admin.id === id) throw new BadRequestException(`User ${admin.fullName} are not valid`);
      await this.userRepository.remove(userFind);
      return true
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.errno === 19 && error.code === 'SQLITE_CONSTRAINT') {
      if (`${error.driverError}`.includes('UNIQUE constraint failed')) {
        const message: string = `${error.driverError}`.replace('SQLITE_CONSTRAINT:', '').replace('UNIQUE constraint failed:', '');
        if (message.includes('User.')) {
          throw new BadRequestException(`${message.split('.')[1]} already exists`);
        }
      }
      if (`${error.driverError}`.includes('FOREIGN KEY constraint failed')) {
        throw new BadRequestException(`Invalid action, depends on other values.`);
      }
      throw new BadRequestException(`${error.driverError}`);
    }

    throw new InternalServerErrorException('Check server logs');
  }
}
