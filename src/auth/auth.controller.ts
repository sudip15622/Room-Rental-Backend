import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserSchema,
  CreateUserType,
} from 'src/user/schemas/create-user.schema';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  @Post('signup')
  async registerUser(@Body() createUserInput: CreateUserType) {
    await this.authService.registerUser(createUserInput);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    const { id, name, image, roles } = req.user;
    return await this.authService.login(id, name, image, roles);
  }

  @Public()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: any) {
    const { id } = req.user;
    return await this.authService.refreshToken(id );
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: any, @Res() res: Response) {
    const user = req.user;
    const response = await this.authService.login(user.id, user.name, user.image, user.roles);

    const {id, name, image, roles, accessToken, refreshToken} = response;

    res.redirect(`http://localhost:3000/api/auth/google/callback?id=${id}&name=${encodeURIComponent(name)}&image=${image}&roles=${encodeURIComponent(roles.join(','))}&accessToken=${accessToken}&refreshToken=${refreshToken}`);

  }

  @Post("logout")
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id);
  }
}
