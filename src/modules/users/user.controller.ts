import { Controller, Delete, Get, Param, Post, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard)
    @Get()
    getUsers(): Promise<UserResponseDto[]> {
        return this.userService.getUsers();
    }

    @Get('/:id')
    getUserById(@Param('id') id: number): Promise<UserResponseDto | null> {
        return this.userService.getUserById(+id);
    }

    @Post()
    createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(data);
    }

    @Put('/:id')
    updateUser(@Param('id') id: number, @Body() data: Partial<UpdateUserDto>): Promise<UserResponseDto | null> {
        return this.userService.updateUser(+id, data);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: number): Promise<{ message: string } | null> {
        return this.userService.deleteUser(+id);
    }
}
