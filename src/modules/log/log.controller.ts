
import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { LogResponseDto } from './dto/log.dto';

@Controller('/logs')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Get()
    getLogs(): Promise<LogResponseDto[]> {
        return this.logService.getLogs();
    }
}