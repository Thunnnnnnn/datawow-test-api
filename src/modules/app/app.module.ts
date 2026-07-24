import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../database/prisma.module';
import { UserModule } from '../users/user.module';
import { ConcertModule } from '../concerts/concert.module';
import { BookHistoriesModule } from '../book-histories/book-histories.module';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConcertModule,
    BookHistoriesModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
