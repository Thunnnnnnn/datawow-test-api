
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { LogResponseDto } from './dto/log.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/constants/role.enum';

@Controller('/logs')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    getLogs(): Promise<LogResponseDto[]> {
        return this.logService.getLogs();
    }
}