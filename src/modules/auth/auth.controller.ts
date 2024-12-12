import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { client_id, client_secret } = registerDto;
    return await this.authService.register(client_id, client_secret);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { client_id, client_secret } = loginDto;
    return await this.authService.login(client_id, client_secret);
  }
}
