import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')//creacion de usuario
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')//comentaroo
  loginUser(@Body() loginUserDto: LoginUserDto) {
    console.log('Login endpoint hit'); // Agrega este console.log
    console.log('Request body:', loginUserDto); // Agrega este console.log
    return  this.authService.login(loginUserDto);
  }


}