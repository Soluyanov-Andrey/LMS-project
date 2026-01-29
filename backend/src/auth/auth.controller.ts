import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
// Изменяем импорт здесь:
import type { Response, Request } from 'express'; 
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response, // Теперь ошибки не будет
  ) {
    const { access_token } = await this.authService.login(email);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax', 
      maxAge: 1 * 24 * 60 * 60 * 1000, 
    });

    return { message: 'Успешный вход' };
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('me')
  // getMe(@Req() req: Request) { // И здесь ошибки не будет
  //   return req.user;
  // }
}