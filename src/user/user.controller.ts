import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  // @Roles("admin")
  async profile(@Request() req: any) {
    const { id } = req.user;
    return await this.userService.findById(id);
  }
}
