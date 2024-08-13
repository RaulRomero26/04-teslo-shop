import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')//creacion de usuario
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')//comentaroo
  loginUser(@Body() loginUserDto: LoginUserDto) {
    console.log('Login endpoint hit');
    console.log('Request body:', loginUserDto); 
    return  this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testigPrivateRoute() {
    return{
      ok: true,
      message: 'Hola mundo private'
    }
  }


}