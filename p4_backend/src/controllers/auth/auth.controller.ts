import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { access_token } = await this.authService.login(loginDto);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false, // true en production avec HTTPS
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, // 1 heure
            path: '/',
        });

        return {
            status: 200,
            message: 'Connexion réussie',
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req: Request & { user: AuthenticatedUser }) {
        return req.user;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
    });

    return {
        status: 204,
        message: 'Déconnexion réussie',
    };
    }
}