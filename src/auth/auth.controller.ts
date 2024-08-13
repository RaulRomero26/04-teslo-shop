import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';

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

  @Get('private')
  @UseGuards(AuthGuard())
  testigPrivateRoute(
    //@Req() request: Express.Request
    @GetUser(['email', 'role','fullName'])user: User
  ) {
    
    return{
      ok: true,
      message: 'Hola mundo private', 
      user
    }
  }


}