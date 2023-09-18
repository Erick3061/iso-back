import { CreateUserDto } from "src/user/dto";
import { TypeUser } from "src/user/enums/user.enum";

interface User extends CreateUserDto { };

export const userAdmin: User = {
    fullName: 'Administrator',
    userName: 'admin',
    password: 'admin1234',
    isActive: true,
    role: TypeUser.admin,
}
