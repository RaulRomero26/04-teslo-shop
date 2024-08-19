import { SetMetadata } from '@nestjs/common';
import { validRoles } from '../../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: string[]) =>{

    return  SetMetadata(META_ROLES, args);
}
