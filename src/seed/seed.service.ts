import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { userAdmin } from './data/data.seed';

@Injectable()
export class SeedService {
  constructor(private readonly userService: UserService) {}

  async initilize() {
    return await this.userService.create(userAdmin);
  }
}
