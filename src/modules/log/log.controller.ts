
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { LogResponseDto } from './dto/log.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/logs')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @UseGuards(AuthGuard)
    @Get()
    getLogs(): Promise<LogResponseDto[]> {
        return this.logService.getLogs();
    }
}