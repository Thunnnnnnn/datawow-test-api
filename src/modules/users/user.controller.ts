import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user.dto';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getUsers(): Promise<UserResponseDto[]> {
        return this.userService.getUsers();
    }
}
