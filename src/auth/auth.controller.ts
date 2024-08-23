import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { validRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')//creacion de usuario
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')//comentaroo
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return  this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){

    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testigPrivateRoute(
    @Req() request: Express.Request,
    @GetUser()user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    
    return{
      ok: true,
      message: 'Hola mundo private', 
      user,
      userEmail,
      rawHeaders
    }
  }
  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(validRoles.superUser, validRoles.admin, validRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ){

    return{
      ok: true,
      message: 'Hola mundo private 2',
      user
    }
  }

  @Get('private3')
  @Auth(validRoles.user)//se puede pasar los roles como argumentos validRoles.superUser, validRoles.admin, validRoles.user
  privateRoute3(
    @GetUser() user: User,
  ){

    return{
      ok: true,
      message: 'Hola mundo private 2',
      user
    }
  }




}