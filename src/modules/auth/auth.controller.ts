
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginRequestDto } from './dto/auth.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    login(@Body() data: LoginRequestDto): Promise<AuthResponseDto> {
        return this.authService.login(data);
    }
}