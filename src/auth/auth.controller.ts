import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from '../dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: createUserDto) {
    return this.authService.signup(user);
  }

  @Post('signin')
  signin(@Body() user: createUserDto) {
    try {
      return this.authService.signin(user);
    } catch (e: any) {
      return 'Unauthorized';
    }
  }
}
