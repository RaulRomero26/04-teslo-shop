import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
//Para obtener los roles de la metadata necesitas importar Reflector de @nestjs/core
@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get('roles',context.getHandler()); 

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if(!user){
      throw new BadRequestException('User not found (request)');
    }

    for( const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException(`User ${ user.fullName} need a valid role: [${validRoles}]`);
    
  }
}
