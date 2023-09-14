import { SetMetadata } from '@nestjs/common';
import { TypeUser } from 'src/user/enums/user.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Array<TypeUser>) => {

    return SetMetadata(META_ROLES, args)
};
